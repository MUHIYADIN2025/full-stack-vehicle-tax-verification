const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'components'),
  path.join(__dirname, 'app')
];

function replaceColors(content) {
  // Replace gradients
  let newContent = content.replace(/from-blue-\d00/g, 'from-[#F12711]');
  newContent = newContent.replace(/to-blue-\d00/g, 'to-[#F5AF19]');
  newContent = newContent.replace(/from-emerald-\d00/g, 'from-[#F12711]');
  newContent = newContent.replace(/to-emerald-\d00/g, 'to-[#F5AF19]');
  newContent = newContent.replace(/from-purple-\d00/g, 'from-[#F12711]');
  newContent = newContent.replace(/to-purple-\d00/g, 'to-[#F5AF19]');
  
  // Replace solids
  newContent = newContent.replace(/bg-blue-\d00/g, 'bg-[#F12711]');
  newContent = newContent.replace(/text-blue-\d00/g, 'text-[#F12711]');
  newContent = newContent.replace(/ring-blue-\d00/g, 'ring-[#F12711]');
  newContent = newContent.replace(/border-blue-\d00/g, 'border-[#F12711]');

  newContent = newContent.replace(/bg-emerald-\d00/g, 'bg-[#F5AF19]');
  newContent = newContent.replace(/text-emerald-\d00/g, 'text-[#F5AF19]');
  newContent = newContent.replace(/ring-emerald-\d00/g, 'ring-[#F5AF19]');
  newContent = newContent.replace(/border-emerald-\d00/g, 'border-[#F5AF19]');
  
  return newContent;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updated = replaceColors(content);
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Theme replacement complete!');
