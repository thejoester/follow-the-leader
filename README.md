# Follow the Leader

A Foundry VTT module that allows one token to follow another using advanced pathfinding powered by [`routinglib`](https://github.com/League-of-Foundry-Developers/routinglib). Ideal for automating NPC companions, minions, or party movement.

---

## 🧭 Features

- 🧠 Utilizes [routinglib](https://foundryvtt.com/packages/routinglib) for intelligent, wall-aware pathfinding.
- 🎯 Select a token, hover over another, and press `F` — the selected token will begin following the target.
- 🎯 Press `F` again, or hover over the follower and press `F`, to cancel following.
- ⛔ Automatically stops following when following token moves manually.
- ⛔ Automatically stops following when combat begins.
- 🛠️ Configurable settings UI

---

## 🚧 Feature Roadmap

- 🚶 Maintain a configurable distance behind the leader.
- ➕ Resume following after combat
- 🧩 Additional pathing options and LOS behaviors
- 🚶 Smoother animated movement rather than "teleporting" tokens. 

---

## 🔧 Installation

Install via manifest URL:  
**`https://github.com/thejoester/follow-the-leader/releases/latest/download/module.json`**

> [!IMPORTANT]  
> This module **requires** [routinglib](https://foundryvtt.com/packages/routinglib). Please ensure it is installed and enabled.

---

## 🎮 How to Use

1. **Select** the token you want to follow with.
2. **Hover** over the token to follow.
3. Press the **`F` key**.

✅ The selected token will start following the hovered token, maintaining a safe, wall-aware path.

To stop following, press `F` again or cancel via the same token.

---

## 🧰 GM Macros

These helper macros are included with the module and available for GM use:

- **Show Followers**  
  Displays a dialog listing all currently-following tokens and their targets.

- **Stop All Follows**  
  Instantly clears all active follow states in the current scene.

You can find and import these macros via the **Compendium** provided by the module ("FTL-Macros").

---
## 💡 Credits & License

- Created by [The Joester](https://github.com/thejoester)  
- Inspired by the original [FollowMe](https://github.com/League-of-Foundry-Developers/followme) module  
- Licensed under the [MIT License](LICENSE)

---

## 🐛 Bugs & Feedback

Found an issue or have suggestions?  
Please open an issue on [GitHub](https://github.com/thejoester/follow-the-leader/issues).
