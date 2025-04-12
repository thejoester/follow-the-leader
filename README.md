# Follow the Leader

A Foundry VTT module that allows one token to follow another, using advanced pathfinding via [`routinglib`](https://github.com/League-of-Foundry-Developers/routinglib). Perfect for managing NPC companions, minions, or group movement.

---

## 🧭 Features

- 🎯 Select a token, hover another, press `F` — the selected token will start following the target.
- 🧠 Uses `routinglib` to plot safe, wall-aware paths.
- 🚶‍♂️ Tokens currently maintain a 2-tile distance behind the target.
- ⛔ Automatically stops following when combat begins.
- 🔄 Continually updates position as the leader moves.

---

## 🔧 Installation

Install via manifest URL: https://github.com/thejoester/follow-the-leader/releases/latest/download/module.json

> [!IMPORTANT]
> Make sure you also have [`routinglib`](https://foundryvtt.com/packages/routinglib) installed and enabled.

---

## 🎮 Usage

1. **Select** a token.
2. **Hover** over the token you want it to follow.
3. Press the **`F` key**.

The selected token will begin following the hovered token, maintaining a safe path and 2-tile buffer.

---

## ⚙️ Future Features (Planned)

- Configurable follow distance
- Resume following after combat

---

## 💡 Credit & License

Created by [The Joester](https://github.com/thejoester)  
Inspired by the original [FollowMe](https://github.com/League-of-Foundry-Developers/followme) module.  
Licensed under MIT.

---

## 🐛 Bugs or Feedback?

Open an issue on [GitHub](https://github.com/thejoester/follow-the-leader/issues).
