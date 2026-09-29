import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    // plugin/kit/react/guards/*.test.ts are for the projects that copy the kit; dsIntact also works
    // here, because plugin/kit/ has the same layout as a project's src/ds/.
    include: ["tests/**/*.test.{ts,tsx}", "plugin/kit/react/guards/dsIntact.test.ts"],
    // The tests read the CSS sources with ?raw (the module id ends in ".css?raw": no $ anchor).
    css: { include: [/\.css/] },
  },
});
