export let LT = {};

Hooks.once("ready", () => {
	LT = {
		// Localized settings labels
		TOGGLE_FOLLOW_NAME: game.i18n.localize("FTL.SETTING_TOGGLE_FOLLOW_NAME"),
		TOGGLE_FOLLOW_HINT: game.i18n.localize("FTL.SETTING_TOGGLE_FOLLOW_HINT"),
		STOP_ON_MANUAL_MOVE_NAME: game.i18n.localize("FTL.SETTING_STOP_ON_MANUAL_MOVE_NAME"),
		STOP_ON_MANUAL_MOVE_HINT: game.i18n.localize("FTL.SETTING_STOP_ON_MANUAL_MOVE_HINT"),
		DEBUG_LEVEL_NAME: game.i18n.localize("FTL.SETTING_DEBUG_LEVEL"),
		DEBUG_LEVEL_HINT: game.i18n.localize("FTL.SETTING_DEBUG_LEVEL_HINT"),
		DEBUG_LEVEL_NONE: game.i18n.localize("FTL.SETTING_DEBUG_NONE"),
		DEBUG_LEVEL_ERROR: game.i18n.localize("FTL.SETTING_DEBUG_ERROR"),
		DEBUG_LEVEL_WARN: game.i18n.localize("FTL.SETTING_DEBUG_WARN"),
		DEBUG_LEVEL_ALL: game.i18n.localize("FTL.SETTING_DEBUG_ALL"),

		// Dynamic chat messages
		START_FOLLOWING: (follower, leader) => game.i18n.format("FTL.CHAT_START_FOLLOW", { follower, leader }),
		stopFollowing: (follower) => game.i18n.format("FTL.CHAT_STOP_FOLLOW", { follower }),
		stopFollowingCombat: (follower) => game.i18n.format("FTL.CHAT_STOP_COMBAT", { follower }),
		stopFollowingManual: (follower, leader) => game.i18n.format("FTL.CHAT_STOP_MANUAL", { follower, leader }),

		WARNING_SELECT_AND_HOVER: game.i18n.localize("FTL.WARNING_SELECT_AND_HOVER"),

		LOST_SIGHT: (actorName, leaderName) => game.i18n.format("FTL.CHAT_LOST_SIGHT", { actorName, leaderName }),
		FOUND_LEADER: (actorName, leaderName) => game.i18n.format("FTL.CHAT_FOUND_LEADER", { actorName, leaderName }),
	};
});
