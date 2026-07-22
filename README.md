# Zenitsu Masterclass: Interactive Cinematic Experience ⚡

An interactive, high-performance web experience showcasing Zenitsu Agatsuma's iconic "Thunderclap and Flash" technique from Demon Slayer. 

Built as a technical masterclass in modern web graphics, this project blends 2D canvas procedural generation, 3D particle physics, and hardware-accelerated CSS animations to create a seamless, cinematic user experience.

## ✨ Features

- **Interactive Drag Reveal**: Smooth GSAP-powered masking transitions between Zenitsu's "Awake" (coward) and "Asleep" (Thunderclap) states.
- **3D Particle System**: Uses Three.js and custom buffer geometries to render ambient forest dust that dynamically shifts into violently rising fire embers based on the user's interaction state.
- **Procedural Canvas Lightning**: A high-performance 2D Canvas rendering loop that generates organic, branching lightning strikes without relying on heavy SVG or DOM elements.
- **Micro-Interactions**: Features a custom GSAP-driven preloader and a dynamic glowing cursor trailing system that replaces the default mouse pointer.
- **Glassmorphism UI**: Beautiful, frosted-glass lore panels that conditionally render based on the viewport and interaction state.
- **Hardware Acceleration**: Utilizes CSS `will-change`, 3D transforms, and layer compositing for a consistent 60FPS experience.

## 🛠 Tech Stack

- **Vite** (Build Tool & Dev Server)
- **Vanilla JavaScript (ES6 Modules)**
- **Three.js** (WebGL 3D Engine)
- **GSAP (GreenSock)** (High-performance animation physics)
- **HTML5 Canvas** (Procedural graphics)
- **CSS3** (Hardware-accelerated animations & UI styling)

## 🚀 Running Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tamim544/zenitsu-masterclass.git
   cd zenitsu-masterclass
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   Navigate to `http://localhost:5173` in your web browser.

## 📸 Preview
*(The project features extreme full-screen animations and dynamic lighting. View locally for the complete 60FPS cinematic experience.)*
