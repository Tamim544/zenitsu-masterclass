# Zenitsu Thunder Awakening ⚡

An interactive, front-end web experience paying homage to Zenitsu Agatsuma from *Demon Slayer (Kimetsu no Yaiba)*.

This project features a dynamic, interactive "wipe" effect that allows users to seamlessly transition Zenitsu between his two states: his energetic waking form and his devastating "Thunderclap and Flash" sleeping form.

## Features
- **Interactive Split-Screen Wipe**: Drag your mouse or finger across the screen to control a glowing slash that reveals Zenitsu's hidden power.
- **Procedural Canvas Lightning**: Custom HTML5 `<canvas>` algorithm that generates randomized, crackling lightning strikes. The intensity of the lightning dynamically scales based on how much of the "Thunderclap" state is revealed!
- **Dynamic Asset Blending**: Utilizes true transparent PNGs over a dark, parallax-enabled Japanese forest background.
- **Lore UI**: An animated details panel that slides in when Zenitsu reaches his maximum power threshold.

## Tech Stack
- **HTML5** & **Vanilla CSS3** (Flexbox, CSS Transitions, Clip-Path)
- **Vanilla JavaScript** (Mouse/Touch Event Listeners, HTML5 Canvas API)

## How to Run Locally
1. Clone this repository.
2. Navigate into the project folder.
3. Run a local development server (e.g., using Python or Node):
   ```bash
   python3 -m http.server 8080
   ```
4. Open `http://localhost:8080` in your web browser.

## Assets
All character and background assets were custom-generated using AI, and programmatically processed to include perfect alpha-channel transparency for seamless web blending.
