// Script to copy PDF.js worker file to the public directory
const fs = require('fs');
const path = require('path');

// Source path in node_modules - corrected path for version 4.x
const sourcePath = path.resolve(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js');

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
  
  // Try alternative path if the first one fails
  try {
    const altSourcePath = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.js');
    fs.copyFileSync(altSourcePath, destPath);
    console.log(`Successfully copied PDF.js worker from alternative path ${altSourcePath} to ${destPath}`);
  } catch (altErr) {
    console.error('Error copying PDF.js worker from alternative path:', altErr);
    
    // Create a simple worker file as fallback
    try {
      // Create a minimal worker file that will allow the app to run
      const minimalWorker = `
      // Minimal PDF.js worker
      self.onmessage = function(event) {
        // Just echo back the received message to acknowledge receipt
        self.postMessage({
          type: 'error',
          error: 'PDF.js worker not available. Using minimal fallback worker.'
        });
      };
      `;
      
      fs.writeFileSync(destPath, minimalWorker);
      console.log('Created minimal fallback worker file');
    } catch (fallbackErr) {
      console.error('Error creating fallback worker:', fallbackErr);
    }
  }
} 