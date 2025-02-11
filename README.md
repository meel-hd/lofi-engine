# LoFi Engine
<p align="center">
    <img alt="Icon" align="center" width="100" height="100" src="app-icon.png" />
</p>
Generate LoFi music on the go. You create your own atmosphere; LoFi Engine sets the mood.

![screenshot](screenshots/screenshot.gif)

## Features 🚀
* Create your own LoFi studio with your unique music with minimal touches from this and that. Be the Artist.
* Works with major desktop platforms: **Linux**, **Mac**, and **Windows**.
* Doesn't require an internet connection; your experience is fully private.
* LoFi Engine's main focus is **customization**, **accessibility**, and **artistic freedom**.

### Customization
1. **Playback**: If you want to listen to music or just listen to birds singing freely, you choose.
2. **Look**: With carefully crafted artworks from talented artists, long study sessions become a joy.
3. **Ambience**: A windy evening or the sound of waves crashing into the sand of a sunny beach brings peace.

### Accessibility
Any action or click you can do with the mouse has a shortcut for it with the keyboard. For playback, effects, ambient tracks, look, etc.

All information about the app and **shortcuts** is available in the *info box* accessible via the **ESC** key.

![info-box](screenshots/info-box.png)

## Future Plan
At the moment, there is only one main LoFi track playing in a loop. For a better and more customizable experience, the main LoFi track should be generated on the go. The current suitable solution could be done using **Magenta.js**. [Learn more!](https://magenta.tensorflow.org/).

## Tech Stack

[![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=Tauri&logoColor=white)](https://tauri.app/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

## Run Locally

To run LofiEngine locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [pnpm](https://pnpm.io/) (v6 or later)
- [Rust](https://www.rust-lang.org/) (latest stable version)
- [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) (based on your operating system)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/LofiEngine.git
   cd LofiEngine
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

### Development

To run the app in development mode:

```
pnpm tauri:d
```

This command will start both the Vite dev server for the frontend and the Tauri development process for the native shell.

### Building

To build the app for production:

```
pnpm tauri:b
```

This will create a production-ready build of your application in the `src-tauri/target/release` directory.

### Additional Commands

- `pnpm dev`: Run the Vite development server without Tauri
- `pnpm build`: Build the frontend assets without Tauri
- `pnpm preview`: Preview the built frontend
- `pnpm check`: Run Svelte type checking

## Contributing
We welcome contributions from the community! If you're interested in contributing to LoFi Engine, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and descriptive messages.
4. Push your changes to your fork.
5. Open a Pull Request to the `main` branch of this repository.

### We Need Your Help with Music Generation!
We are looking for contributors to help with implementing real-time music generation. If you have experience with:
- **Magenta.js** or other music generation libraries
- Real-time audio processing
- Music theory and composition

Please consider contributing to this exciting feature!

## License
MIT
