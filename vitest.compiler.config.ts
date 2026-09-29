import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// The kit compiled with React Compiler, the way a project that turns it on gets it: hooks and
// components must stay correct when the compiler memoizes them.
export default defineConfig({
  plugins: [react({ compiler: true })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    include: ["tests/compiler/**/*.test.{ts,tsx}"],
  },
});
