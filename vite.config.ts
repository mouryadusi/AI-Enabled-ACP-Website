import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vite config: React + TS. Kept minimal and deployment-neutral so it runs
// unmodified on Vercel, Netlify, or any static host.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: { port: 5173 },

  preview: {
    allowedHosts: ["aircraft-conflict-frontend.onrender.com"],
  },

  build: {
    target: "es2020",
    sourcemap: true,
  },
});
