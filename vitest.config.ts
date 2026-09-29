import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    // kit/react/guards/*.test.ts are for the projects that copy the kit, not for this repository.
    include: ["tests/**/*.test.{ts,tsx}"],
    // The tests read the CSS sources with ?raw (the module id ends in ".css?raw": no $ anchor).
    css: { include: [/\.css/] },
  },
});
