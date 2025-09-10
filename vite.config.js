import { resolve } from "path";
import { defineConfig } from "vite";
import { readdirSync, copyFileSync, existsSync, mkdirSync } from "fs";

// Function to manually copy images after build
function copyImages() {
  const srcDir = resolve(__dirname, "src/public/images");
  const destDir = resolve(__dirname, "dist/images");
  
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }
  
  // Recursive copy of all image files
  function copyRecursive(src, dest) {
    if (existsSync(src)) {
      const items = readdirSync(src, { withFileTypes: true });
      
      for (const item of items) {
        const srcPath = resolve(src, item.name);
        const destPath = resolve(dest, item.name);
        
        if (item.isDirectory()) {
          if (!existsSync(destPath)) {
            mkdirSync(destPath, { recursive: true });
          }
          copyRecursive(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    }
  }
  
  copyRecursive(srcDir, destDir);
}

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    // Configuration to include all assets
    assetsInclude: ["**/*.jpg", "**/*.png", "**/*.svg", "**/*.webp", "**/*.jpeg"],
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"), 
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
      },
    },

    async writeBundle() {
      copyImages();
    }
  },
  publicDir: "public",
  server: {
    port: 5173,
    open: true,
  },
});