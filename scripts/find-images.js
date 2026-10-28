const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));
const pages = JSON.parse(fs.readFileSync('scripts/dump/all_120_pages.json'));

console.log('Inspecting XObjects of all 120 pages:');

// Look for image objects in PDF
// Each image object has /Subtype/Image or /Subtype /Image
let allImageObjs = [];
let re = /(\d+)\s+0\s+obj\s*<<([\s\S]*?)>>\s*stream/g;
let m;
let bufStr = buffer.toString('binary');
while ((m = re.exec(bufStr)) !== null) {
  let id = parseInt(m[1]);
  let dict = m[2];
  if (dict.includes('/Subtype/Image') || dict.includes('/Subtype /Image')) {
    let sStart = m.index + m[0].length;
    if (buffer[sStart] === 13) sStart++;
    if (buffer[sStart] === 10) sStart++;
    let lenMatch = dict.match(/\/Length\s+(\d+)/);
    let len = lenMatch ? parseInt(lenMatch[1]) : 0;
    let isJpeg = buffer[sStart] === 0xff && buffer[sStart + 1] === 0xd8;
    allImageObjs.push({ id, offset: sStart, len, isJpeg, dict: dict.replace(/[\r\n]+/g, ' ') });
  }
}

console.log('Total /Subtype/Image objects found in entire PDF:', allImageObjs.length);
// Sort by length or offset
console.log('First 5 image objects:', allImageObjs.slice(0, 5));

// Write all full-page image objects to disk
// Filter for large images (full page scans are typically > 50,000 bytes)
let fullPageImages = allImageObjs.filter(img => img.len > 40000 && img.isJpeg);
console.log('Full-page scan images found (>40KB JPEG):', fullPageImages.length);

fs.writeFileSync('scripts/dump/image_objects.json', JSON.stringify(fullPageImages, null, 2));
