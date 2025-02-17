import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist", // Default output folder
    rollupOptions: {
      input: "/index.html", // Ensure your entry file is correctly referenced
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom"],
          uiLibs: ["@tanstack/react-query", "@radix-ui/react-dialog", "lucide-react"],
        },
      },
    },
  },
  // ... shadcn/ui configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ...
});
