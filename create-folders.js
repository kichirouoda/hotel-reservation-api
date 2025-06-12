const fs = require('fs');
const path = require('path');

const folders = [
  'src/config',
  'src/controllers',
  'src/middleware',
  'src/models',
  'src/routes',
  'src/services',
  'src/types',
  'src/utils',
  'tests'
];

folders.forEach(folder => {
  fs.mkdirSync(path.join(__dirname, folder), { recursive: true });
  console.log(`Created folder: ${folder}`);
});

console.log('Folder structure created successfully!');
