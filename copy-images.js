const fs = require("fs");
const path = require("path");

function copyImages() {
  const sourceDir = path.join(__dirname, "src", "public", "images");
  const destDir = path.join(__dirname, "dist", "images");

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Function to copy files recursively
  function copyRecursive(source, destination) {
    const stats = fs.statSync(source);
    
    if (stats.isDirectory()) {
      // Create the destination directory if it doesn't exist
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      // Read all items in the directory
      const items = fs.readdirSync(source);
      
      // Copy each item
      items.forEach((item) => {
        const sourcePath = path.join(source, item);
        const destPath = path.join(destination, item);
        copyRecursive(sourcePath, destPath);
      });
    } else {
      // It's a file, copy it
      fs.copyFileSync(source, destination);
    }
  }

  // Start the recursive copy
  copyRecursive(sourceDir, destDir);
}

// Execute the function
copyImages();