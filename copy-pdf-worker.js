// Script to copy PDF.js worker file to the public directory
const fs = require('fs');
const path = require('path');

// Source path in node_modules
const sourcePath = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.js');

// Destination path in public directory
const destPath = path.resolve(__dirname, 'public/pdf.worker.min.js');

// Create directory if it doesn't exist
const destDir = path.dirname(destPath);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the file
try {
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Successfully copied PDF.js worker from ${sourcePath} to ${destPath}`);
} catch (err) {
  console.error('Error copying PDF.js worker file:', err);
} 