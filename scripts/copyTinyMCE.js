import fs from 'fs-extra';
import path from 'path';

const source = path.resolve('node_modules', 'tinymce');
const destination = path.resolve('public', 'tinymce');

// Ensure the destination directory exists
fs.ensureDirSync(destination);

// Copy TinyMCE files to public directory
fs.copySync(source, destination, {
  filter: (src) => {
    // Only copy necessary files and folders
    const relativePath = path.relative(source, src);
    return (
      !relativePath.startsWith('.')  // Skip hidden files
      && !relativePath.includes('node_modules')  // Skip nested node_modules
      && !relativePath.includes('test')  // Skip test files
      && !relativePath.includes('demo')  // Skip demo files
    );
  }
});

console.log('TinyMCE files copied successfully!');