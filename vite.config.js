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
    assetsInclude: [
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.webp",
      "**/*.jpeg",
      "**/*.gif",
      "**/*.ico"
    ],
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        product_listing: resolve(__dirname, "src/product_listing/index.html"),
        // AJOUTEZ TOUTES VOS NOUVELLES PAGES ICI :
        // about: resolve(__dirname, "src/about/index.html"),
        // contact: resolve(__dirname, "src/contact/index.html"),
        // Ajoutez d'autres pages au besoin
      },
    },
    async writeBundle() {
      copyImages();
    },
  },
  publicDir: "public",
  server: {
    port: 5173,
    open: true,
  },
  // Optimisation pour le déploiement
  preview: {
    port: 4173,
    open: true
  }
});