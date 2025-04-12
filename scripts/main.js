/*
  Follow the Leader
  https://github.com/thejoester/follow-the-leader
*/

Hooks.once("routinglib.ready", () => {
	console.log("Follow the Leader | routinglib is ready");

	Hooks.on("updateToken", async (token, change, options, userId) => {
		if (!token || !game.user.isGM) return;
		if (!change.x && !change.y) return;

		// Get followers for this token
		const followers = canvas.tokens.placeables.filter(t =>
			t.document.getFlag("follow-the-leader", "following") === token.id
		);

		if (!followers.length) return;

		for (const follower of followers) {
			const from = { x: follower.x, y: follower.y };
			const to = { x: token.x, y: token.y };

			try {
				const result = await routinglib.calculatePath(from, to, {
					token: follower,
					interpolate: true
				});

				if (result?.path) {
					const followDistance = canvas.grid.size * 2; // Stay 2 tiles behind
					let walked = 0;

					for (let i = 0; i < result.path.length; i++) {
						const step = result.path[i];
						if (walked + canvas.grid.size > result.cost - followDistance) break;
						await follower.document.update({ x: step.x, y: step.y }, { by_following: true });
						await foundry.utils.sleep(100);
						walked += canvas.grid.size;
					}
				}
			} catch (e) {
				console.warn(`Follow the Leader | Failed to calculate path for follower ${follower.name}:`, e);
			}
		}
	});

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

Hooks.on("ready", () => {
	console.log("Follow the Leader | Ready");

	// Setup keypress listener
	window.addEventListener("keydown", event => {
		if (event.key !== "f" || !canvas.tokens.controlled.length) return;
		const selected = canvas.tokens.controlled[0];
		const hovered = canvas.tokens.placeables.find(t => t.hover);
		if (!hovered || selected === hovered) return;

		selected.document.setFlag("follow-the-leader", "following", hovered.id);
		ui.notifications.info(`${selected.name} is now following ${hovered.name}`);
	});
});
