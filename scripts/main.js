import { debugLog, getSetting } from './settings.js';
import { LT } from './localization.js';

/*
Follow the Leader
https://github.com/thejoester/follow-the-leader
*/

function isInSceneBounds(x, y) {
	const { width, height } = canvas.dimensions.sceneRect;
	return x >= 0 && y >= 0 && x <= width && y <= height;
}

function clampToScene(x, y) {
	const maxX = canvas.dimensions.sceneRect.width;
	const maxY = canvas.dimensions.sceneRect.height;
	return {
		x: Math.clamp(x, 0, maxX - 1),
		y: Math.clamp(y, 0, maxY - 1)
	};
}

function getSnapPointForToken(gridX, gridY, token) {
	const grid = canvas.grid;
	const offset = grid.getOffset({ x: gridX, y: gridY });
	if (offset?.i === undefined || offset?.j === undefined) throw new Error("Invalid offset from grid");
	const x = (gridX + offset.i) * grid.size;
	const y = (gridY + offset.j) * grid.size;
	return { x, y };
}

const tokensMovedByFollow = new Set();

Hooks.once("routinglib.ready", () => {
	debugLog("routinglib is ready");

	function buildFollowMap() {
		const map = new Map();
		for (const token of canvas.tokens.placeables) {
			const leaderId = token.document.getFlag("follow-the-leader", "following");
			if (leaderId) map.set(token.id, leaderId);
		}
		return map;
	}

	function getFollowers(followMap, leaderId) {
		return [...followMap.entries()]
			.filter(([followerId, follows]) => follows === leaderId)
			.map(([followerId]) => followerId);
	}

	async function moveFollowersRecursive(leaderId, originalPositions, followMap, visited = new Set()) {
		const followers = getFollowers(followMap, leaderId);
		for (const followerId of followers) {
			if (visited.has(followerId)) {
				debugLog(2, `Skipping ${followerId} to avoid recursion loop`);
				continue;
			}
			visited.add(followerId);

			const follower = canvas.tokens.get(followerId);
			const followerFrom = originalPositions.get(followerId);
			const leaderFrom = originalPositions.get(leaderId);
			if (!follower || !followerFrom || !leaderFrom) {
				debugLog(2, `Missing follower or positions for ${followerId}`);
				continue;
			}

			debugLog(`Routing ${follower.name} from (${followerFrom.x},${followerFrom.y}) to (${leaderFrom.x},${leaderFrom.y})`);

			try {
				const result = await routinglib.calculatePath(followerFrom, leaderFrom, {
					token: follower,
					interpolate: true,
					maxDistance: 100
				});
				if (!result?.path?.length) {
					debugLog(2, `No valid path for ${follower.name}`);
					continue;
				}

				for (const step of result.path) {
					const snap = getSnapPointForToken(step.x, step.y, follower);
					debugLog(`'${follower.name}' teleporting to`, snap);
					tokensMovedByFollow.add(follower.id);
					await follower.document.update({ x: Math.round(snap.x), y: Math.round(snap.y) }, { animate: false });
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			} catch (err) {
				debugLog(3, `Routing error for ${follower?.name}:`, err);
			}

			await moveFollowersRecursive(followerId, originalPositions, followMap, visited);
		}
	}

	Hooks.on("updateToken", async (token, change, options, userId) => {
		const tokenDoc = token.document ?? token;

		if (tokensMovedByFollow.has(tokenDoc.id)) {
			tokensMovedByFollow.delete(tokenDoc.id);
			return;
		}

		const wasFollowing = tokenDoc.getFlag("follow-the-leader", "following");
		const stopOnManualMove = getSetting("stopOnManualMove", false);
		debugLog(`stopOnManualMove: ${stopOnManualMove} | wasFollowing: ${wasFollowing}`);

		if (stopOnManualMove && wasFollowing && (change.x !== undefined || change.y !== undefined)) {
			if (userId === game.user.id) {
				debugLog(`${token.name} stopped following (moved manually).`);
				await tokenDoc.unsetFlag("follow-the-leader", "following");
				ui.notifications.info(LT.stopFollowingManual(token.name, canvas.tokens.get(wasFollowing)?.name ?? "their leader"));
				return;
			}
		}

		if (!game.user.isGM) return;
		if (!token || (!change.x && !change.y)) return;

		const gridSize = canvas.grid.size;
		const originalPositions = new Map();
		for (const t of canvas.tokens.placeables) {
			const gx = Math.floor(t.x / gridSize);
			const gy = Math.floor(t.y / gridSize);
			originalPositions.set(t.id, { x: gx, y: gy });
		}
		debugLog("Captured original token positions.", originalPositions);

		const followMap = buildFollowMap();
		debugLog("Built follower map.", followMap);

		await moveFollowersRecursive(tokenDoc.id, originalPositions, followMap);
	});

	Hooks.on("combatStart", () => {
		if (!game.user.isGM) return;
		for (const token of canvas.tokens.placeables) {
			if (token.document.getFlag("follow-the-leader", "following")) {
				token.document.unsetFlag("follow-the-leader", "following");
				ui.notifications.info(LT.stopFollowingCombat(token.name));
			}
		}
	});
});

Hooks.once("init", () => {
	debugLog("Init");

	game.keybindings.register("follow-the-leader", "toggle-follow", {
		name: game.i18n.localize(LT.TOGGLE_FOLLOW_NAME),
		hint: game.i18n.localize(LT.TOGGLE_FOLLOW_HINT),
		onDown: () => {
			const selected = canvas.tokens.controlled[0];
			const hovered = canvas.tokens.placeables.find(t => t.hover);

			if (!selected || !hovered) {
				ui.notifications.warn(game.i18n.localize(LT.WARNING_SELECT_AND_HOVER));
				return false;
			}

			const currentFollowId = selected.document.getFlag("follow-the-leader", "following");

			if (currentFollowId === hovered.id || hovered.id === selected.id) {
				selected.document.unsetFlag("follow-the-leader", "following");
				ui.notifications.info(LT.stopFollowing(selected.name));
				debugLog(`${selected.name} stopped following.`);
			} else {
				selected.document.setFlag("follow-the-leader", "following", hovered.id);
				ui.notifications.info(LT.START_FOLLOWING(selected.name, hovered.name));
				debugLog(`${selected.name} is now following ${hovered.name}.`);
			}
			return true;
		},
		restricted: false,
		editable: [{ key: "KeyF" }],
		precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
	});
});
