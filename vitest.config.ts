import { defineConfig } from "vitest/config";

// Dedicated Vitest config so the test runner does NOT load the Svelte/Tauri
// vite.config.ts (which pulls in the Svelte plugin). The engine tests cover
// pure, framework-free generation logic, so no DOM/Tone/Svelte is required.
export default defineConfig({
  test: {
    include: ["src/lib/engine/**/*.test.ts"],
    environment: "node",
  },
});
