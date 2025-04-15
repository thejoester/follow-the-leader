# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-04-15
### Changed
- Changed icon artwork for macros to not use generative AI art. 
  - Art created by [TheJoester](https://github.com/thejoester/)

## [1.0.0] - 2025-04-13
### Added
- Localization! All chat messages, settings, and keybinds now support translation.
- Will stop following if manually moved, can enable/disable in settings
- Added Keybinding setting, can change the triggering key.

## [0.0.2] - 2025-04-13
### ADDED
- Followers use follow route utilizing [routinglib](https://github.com/manuelVo/foundryvtt-routinglib) library, avoiding walls.
- Movement is clamped to scene bounds to prevent invalid destination errors.
- debug logs in console (currently set to all) timestamped debug output.
- Stops all follows when combat starts.
- Macro to display active follow map. 
- Macro to stop all follows. 

## [0.0.1] - 2025-04-07
### ADDED
- Initial release
