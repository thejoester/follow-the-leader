console.log(`%cFollow the Leader | settings.js loaded`, "color: BurlyWood; font-weight: bold;");
export function debugLog(intLogType, stringLogMsg, objObject = null) {
	
	// Get Timestamps
	const now = new Date();
	const timestamp = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
	
	// Handle the case where the first argument is a string
	if (typeof intLogType === "string") {
		objObject = stringLogMsg; // Shift arguments
		stringLogMsg = intLogType;
		intLogType = 1; // Default log type to 'all'
	}
	const debugLevel = game.settings.get("pf2e-alchemist-remaster-ducttape", "debugLevel");

	// Map debugLevel setting to numeric value for comparison
	const levelMap = {
		"none": 4,
		"error": 3,
		"warn": 2,
		"all": 1
	};

	const currentLevel = levelMap[debugLevel] || 4; // Default to 'none' if debugLevel is undefined

	// Check if the log type should be logged based on the current debug level
	if (intLogType < currentLevel) return;

	// Capture stack trace to get file and line number
	const stack = new Error().stack.split("\n");
	let fileInfo = "Unknown Source";
	for (let i = 2; i < stack.length; i++) {
		const line = stack[i].trim();
		const fileInfoMatch = line.match(/(\/[^)]+):(\d+):(\d+)/); // Match file path and line number
		if (fileInfoMatch) {
			const [, filePath, lineNumber] = fileInfoMatch;
			const fileName = filePath.split("/").pop(); // Extract just the file name
			// Ensure the file is one of the allowed files
			const allowedFiles = ["main.js"];
			if (allowedFiles.includes(fileName)) {
				fileInfo = `${fileName}:${lineNumber}`;
				break;
			}
		}
	}

	// Prepend the file and line info to the log message
	const formattedLogMsg = `[${fileInfo}] ${stringLogMsg}`;
	
	if (objObject) {
		switch (intLogType) {
			case 1: // Info/Log (all)
				console.log(`%cFollow the Leader[${timestamp}] | ${formattedLogMsg}`, "color: BurlyWood; font-weight: bold;", objObject);
				break;
			case 2: // Warning
				console.log(`%cFollow the Leader[${timestamp}] | WARNING: ${formattedLogMsg}`, "color: orange; font-weight: bold;", objObject);
				break;
			case 3: // Critical/Error
				console.log(`%cFollow the Leader[${timestamp}] | ERROR: ${formattedLogMsg}`, "color: red; font-weight: bold;", objObject);
				break;
			default:
				console.log(`%cFollow the Leader[${timestamp}] | ${formattedLogMsg}`, "color: BurlyWood; font-weight: bold;", objObject);
		}
	} else {
		switch (intLogType) {
			case 1: // Info/Log (all)
				console.log(`%cFollow the Leader[${timestamp}] | ${formattedLogMsg}`, "color: BurlyWood; font-weight: bold;");
				break;
			case 2: // Warning
				console.log(`%cFollow the Leader[${timestamp}] | WARNING: ${formattedLogMsg}`, "color: orange; font-weight: bold;");
				break;
			case 3: // Critical/Error
				console.log(`%cFollow the Leader[${timestamp}] | ERROR: ${formattedLogMsg}`, "color: red; font-weight: bold;");
				break;
			default:
				console.log(`%cFollow the Leader[${timestamp}] | ${formattedLogMsg}`, "color: BurlyWood; font-weight: bold;");
		}
	}
}

export function getSetting(settingName, returnIfError = false) {
    // Validate the setting name
    if (typeof settingName !== "string" || settingName.trim() === "") {
        debugLog(3, `Invalid setting name provided: ${settingName}`);
        return returnIfError; // Return undefined or a default value
    }

    // Check if the setting is registered
    if (!game.settings.settings.has(`pf2e-alchemist-remaster-ducttape.${settingName}`)) {
        debugLog(3, `Setting "${settingName}" is not registered.`);
        return returnIfError; // Return undefined or a default value
    }

    try {
        // Attempt to retrieve the setting value
        const value = game.settings.get("pf2e-alchemist-remaster-ducttape", settingName);
        //debugLog(1, `Successfully retrieved setting "${settingName}":`, value);
        return value;
    } catch (error) {
        // Log the error and return undefined or a default value
        debugLog(3, `Failed to get setting "${settingName}":`, error);
        return returnIfError;
    }
}


Hooks.once("init", () => {
	
/*
	Debugging
*/
	// Register debugLevel setting
	game.settings.register("pf2e-alchemist-remaster-ducttape", "debugLevel", {
		name: game.i18n.localize("PF2E_ALCHEMIST_REMASTER_DUCTTAPE.SETTING_DEBUG_LEVEL"),
		hint: game.i18n.localize("PF2E_ALCHEMIST_REMASTER_DUCTTAPE.SETTING_DEBUG_LEVEL_HINT"),
		scope: "world",
		config: true,
		type: String,
		choices: {
			"none": game.i18n.localize("PF2E_ALCHEMIST_REMASTER_DUCTTAPE.SETTING_DEBUG_NONE"),
			"error": game.i18n.localize("PF2E_ALCHEMIST_REMASTER_DUCTTAPE.SETTING_DEBUG_ERROR"),
			"warn": game.i18n.localize("PF2E_ALCHEMIST_REMASTER_DUCTTAPE.SETTING_DEBUG_WARN"),
			"all": game.i18n.localize("PF2E_ALCHEMIST_REMASTER_DUCTTAPE.SETTING_DEBUG_ALL")
		},
		default: "all", // Default to no logging
		requiresReload: false
	});

	// Log debug status
	const debugLevel = game.settings.get("pf2e-alchemist-remaster-ducttape", "debugLevel");
	console.log(`%cPF2E Alchemist Remaster Duct Tape | Debugging Level: ${debugLevel}`,"color: aqua; font-weight: bold;");
});