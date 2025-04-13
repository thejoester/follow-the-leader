import { debugLog } from './settings.js';

/*
Follow the Leader
https://github.com/yourname/follow-the-leader
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

// Internal tracking for movement loop
const tokensMovedByFollow = new Set();
let isRoutingInProgress = false;

Hooks.once("routinglib.ready", () => {
	debugLog("routinglib is ready");

	// Map from token.id => token.id they're following
	function buildFollowMap() {
		const map = new Map();
		for (const token of canvas.tokens.placeables) {
			const leaderId = token.document.getFlag("follow-the-leader", "following");
			if (leaderId) map.set(token.id, leaderId);
		}
		return map;
	}

	// Get list of token ids that are following the given tokenId
	function getFollowers(followMap, leaderId) {
		return [...followMap.entries()]
			.filter(([followerId, follows]) => follows === leaderId)
			.map(([followerId]) => followerId);
	}

	// Recursively move all followers of the given leader
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
					await follower.document.update({ x: Math.round(snap.x), y: Math.round(snap.y) }, { animate: false });
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			} catch (err) {
				debugLog(3, `Routing error for ${follower?.name}:`, err);
			}

			// Recursively move their followers
			await moveFollowersRecursive(followerId, originalPositions, followMap, visited);
		}
	}

	// Hook into token updates
	Hooks.on("updateToken", async (token, change, options, userId) => {
		if (!game.user.isGM) return; // ensure movement code is only run from GM
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

		await moveFollowersRecursive(token.id, originalPositions, followMap);
	});


	// Clear all follow flags when combat starts
	Hooks.on("combatStart", () => {
		if (!game.user.isGM) return;
		for (const token of canvas.tokens.placeables) {
			if (token.document.getFlag("follow-the-leader", "following")) {
				token.document.unsetFlag("follow-the-leader", "following");
				ui.notifications.info(`${token.name} stopped following (combat started)`);
			}
		}
	});
});

// Toggle follow mode with 'F' key between selected and hovered tokens
Hooks.on("ready", () => {
	debugLog("Ready");

	window.addEventListener("keydown", event => {
		if (event.key !== "f" || !canvas.tokens.controlled.length) return;

		const selected = canvas.tokens.controlled[0];
		const hovered = canvas.tokens.placeables.find(t => t.hover);
		if (!hovered || !selected) return;

		const currentFollowId = selected.document.getFlag("follow-the-leader", "following");

		if (currentFollowId === hovered.id || hovered.id === selected.id) {
			selected.document.unsetFlag("follow-the-leader", "following");
			ui.notifications.info(`${selected.name} stopped following`);
		} else {
			selected.document.setFlag("follow-the-leader", "following", hovered.id);
			ui.notifications.info(`${selected.name} is now following ${hovered.name}`);
		}
	});
});
