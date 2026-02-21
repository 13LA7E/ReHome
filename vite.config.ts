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
    // Prevent TF chunk from being preloaded on every page — it's huge and
    // only needed on /upload and /multi-upload (which are lazy-loaded).
    modulePreload: {
      resolveDependencies(_url: string, deps: string[]) {
        return deps.filter(dep => !dep.includes('tensorflow'));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // TensorFlow.js and MobileNet in their own lazy chunk (~3.5 MB)
          // so it only downloads when the Upload page is visited
          if (id.includes('@tensorflow')) {
            return 'tensorflow';
          }
          // Vendor chunk for large stable libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 4000,
  },
}));
