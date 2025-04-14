console.log(`%cFollow the Leader | settings.js loaded`, "color: BurlyWood; font-weight: bold;");
import { LT } from './localization.js';

export function debugLog(intLogType, stringLogMsg, objObject = null) {
	const now = new Date();
	const timestamp = now.toTimeString().split(' ')[0];

	if (typeof intLogType === "string") {
		objObject = stringLogMsg;
		stringLogMsg = intLogType;
		intLogType = 1;
	}
	const debugLevel = game.settings.get("follow-the-leader", "debugLevel");

	const levelMap = {
		"none": 4,
		"error": 3,
		"warn": 2,
		"all": 1
	};
	const currentLevel = levelMap[debugLevel] || 4;
	if (intLogType < currentLevel) return;

	const stack = new Error().stack.split("\n");
	let fileInfo = "Unknown Source";
	for (let i = 2; i < stack.length; i++) {
		const line = stack[i].trim();
		const match = line.match(/(\/[^)]+):(\d+):(\d+)/);
		if (match) {
			const [, path, lineNum] = match;
			const fileName = path.split("/").pop();
			if (["main.js", "settings.js"].includes(fileName)) {
				fileInfo = `${fileName}:${lineNum}`;
				break;
			}
		}
	}

	const formatted = `[${fileInfo}] ${stringLogMsg}`;
	const style = "color: BurlyWood; font-weight: bold;";
	const warnStyle = "color: orange; font-weight: bold;";
	const errStyle = "color: red; font-weight: bold;";

	if (objObject) {
		if (intLogType === 3) console.log(`%cFollow the Leader[${timestamp}] | ERROR: ${formatted}`, errStyle, objObject);
		else if (intLogType === 2) console.log(`%cFollow the Leader[${timestamp}] | WARNING: ${formatted}`, warnStyle, objObject);
		else console.log(`%cFollow the Leader[${timestamp}] | ${formatted}`, style, objObject);
	} else {
		if (intLogType === 3) console.log(`%cFollow the Leader[${timestamp}] | ERROR: ${formatted}`, errStyle);
		else if (intLogType === 2) console.log(`%cFollow the Leader[${timestamp}] | WARNING: ${formatted}`, warnStyle);
		else console.log(`%cFollow the Leader[${timestamp}] | ${formatted}`, style);
	}
}

export function getSetting(settingName, returnIfError = false) {
	if (typeof settingName !== "string" || settingName.trim() === "") {
		debugLog(3, `Invalid setting name provided: ${settingName}`);
		return returnIfError;
	}

	if (!game.settings.settings.has(`follow-the-leader.${settingName}`)) {
		debugLog(3, `Setting "${settingName}" is not registered.`);
		return returnIfError;
	}

	try {
		return game.settings.get("follow-the-leader", settingName);
	} catch (error) {
		debugLog(3, `Failed to get setting "${settingName}":`, error);
		return returnIfError;
	}
}

Hooks.once("init", () => {
	

game.settings.register("follow-the-leader", "stopOnManualMove", {
	name: LT.STOP_ON_MANUAL_MOVE_NAME,
	hint: LT.STOP_ON_MANUAL_MOVE_HINT,
	scope: "client",
	config: true,
	default: true,
	type: Boolean
});

game.settings.register("follow-the-leader", "debugLevel", {
	name: LT.DEBUG_LEVEL_NAME,
	hint: LT.DEBUG_LEVEL_HINT,
	scope: "world",
	config: true,
	type: String,
	choices: {
		"none": LT.DEBUG_LEVEL_NONE,
		"error": LT.DEBUG_LEVEL_ERROR,
		"warn": LT.DEBUG_LEVEL_WARN,
		"all": LT.DEBUG_LEVEL_ALL
	},
	default: "all",
	requiresReload: false
});
const level = game.settings.get("follow-the-leader", "debugLevel");
console.log(`%cFollow the Leader | Debugging Level: ${level}`, "color: BurlyWood; font-weight: bold;");

});
