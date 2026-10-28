const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));
const fullPageImages = JSON.parse(fs.readFileSync('scripts/dump/image_objects.json'));
const pages = JSON.parse(fs.readFileSync('scripts/dump/all_120_pages.json'));

const outDir = 'scripts/dump/all_pages';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let extractedCount = 0;
for (let i = 0; i < pages.length; i++) {
  let p = pages[i];
  let refs = [...p.data.matchAll(/\/([A-Za-z0-9]+)\s+(\d+)\s+0\s+R/g)];
  let foundImg = null;
  
  for (let match of refs) {
    let id = parseInt(match[2]);
    let img = fullPageImages.find(img => img.id === id);
    if (img) {
      foundImg = img;
      break;
    }
  }

  if (foundImg) {
    let imgBytes = buffer.subarray(foundImg.offset, foundImg.offset + foundImg.len);
    let filename = `page_${String(i + 1).padStart(3, '0')}.jpg`;
    fs.writeFileSync(path.join(outDir, filename), imgBytes);
    extractedCount++;
  } else {
    console.warn(`Could not find large image for page ${i + 1}`);
  }
}

console.log(`Successfully extracted ${extractedCount} of 120 full-page images!`);
