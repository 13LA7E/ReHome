import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/ReHome/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep vendor chunk for large stable libraries
          // NOTE: Do NOT put @tensorflow here — it must stay as a true lazy
          // async chunk so it never runs during initial page load.
          if (id.includes('node_modules') && !id.includes('@tensorflow')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 4000,
  },
}));
