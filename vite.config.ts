import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    sourcemap: true
  },
  resolve: {
    alias: {
      "$fonts": "/src/assets/fonts"
    }
  }
});
