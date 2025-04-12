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
					for (const step of result.path) {
						await follower.document.update({ x: step.x, y: step.y }, { by_following: true });
						await foundry.utils.sleep(100); // adjust for pacing
					}
				}
			} catch (e) {
				console.warn(`Follow the Leader | Failed to calculate path for follower ${follower.name}:`, e);
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
