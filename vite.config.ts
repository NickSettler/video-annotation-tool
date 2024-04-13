import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  base: "/",
  plugins: [react(), eslint()],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "$fonts": "/src/assets/fonts"
    }
  },
  server: {
    host: '::0',
  }
});
