const fs = require('fs');
const path = require('path');

console.log('Starting image copy process...');

const srcDir = path.join(__dirname, 'src', 'public', 'images');
const destDir = path.join(__dirname, 'dist', 'images');

function copyRecursive(src, dest) {
  try {
    if (fs.existsSync(src)) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
        console.log(`Directory created: ${dest}`);
      }

      const items = fs.readdirSync(src, { withFileTypes: true });
      
      let copiedCount = 0;
      
      for (const item of items) {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        
        if (item.isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          // Delete the destination file if it already exists
          if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
            console.log(`Deleted old file: ${item.name}`);
          }
          
          // Copy the file
          fs.copyFileSync(srcPath, destPath);
          copiedCount++;
          console.log(`Copied: ${item.name}`);
        }
      }
      
      if (copiedCount > 0) {
        console.log(`${copiedCount} image file(s) copied`);
      }
    } else {
      console.log(`Source directory not found: ${src}`);
    }
  } catch (error) {
    console.error(`Error during copying: ${error.message}`);
  }
}

console.log(`Source: ${srcDir}`);
console.log(`Destination: ${destDir}`);

// Clean up the destination folder before copying
if (fs.existsSync(path.join(destDir, 'tents'))) {
  const tentFiles = fs.readdirSync(path.join(destDir, 'tents'));
  tentFiles.forEach(file => {
    if (file.includes('_2.')) {
      const oldPath = path.join(destDir, 'tents', file);
      const newPath = path.join(destDir, 'tents', file.replace('_2', ''));
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} -> ${file.replace('_2', '')}`);
      }
    }
  });
}

copyRecursive(srcDir, destDir);
console.log('Image copy process completed!');