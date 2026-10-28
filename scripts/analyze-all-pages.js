const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));
const pages = JSON.parse(fs.readFileSync('scripts/dump/all_120_pages.json'));

console.log('Total pages in list:', pages.length);

// Parse xref table to quickly find any object offset in buffer
// In PDF 1.7, xref stream 763 has the table
// But we can also index "\n<id> 0 obj" directly
const objOffsets = new Map();
let re = /(?:^|\r|\n)(\d+)\s+0\s+obj/g;
let m;
let bufferStr = buffer.toString('binary');
while ((m = re.exec(bufferStr)) !== null) {
  objOffsets.set(parseInt(m[1]), m.index + (m[0].startsWith('\n') || m[0].startsWith('\r') ? 1 : 0));
}
console.log('Indexed direct objects:', objOffsets.size);

function getDirectObject(id) {
  let off = objOffsets.get(id);
  if (off === undefined) return null;
  let endObj = bufferStr.indexOf('endobj', off);
  if (endObj === -1) endObj = bufferStr.length;
  let headerEnd = bufferStr.indexOf('stream', off);
  let hasStream = (headerEnd !== -1 && headerEnd < endObj);
  let header = bufferStr.substring(off, hasStream ? headerEnd : endObj);
  let stream = null;
  if (hasStream) {
    let sStart = headerEnd + 6;
    if (buffer[sStart] === 13) sStart++;
    if (buffer[sStart] === 10) sStart++;
    let sEnd = bufferStr.indexOf('endstream', sStart);
    let raw = buffer.subarray(sStart, sEnd);
    try {
      stream = zlib.inflateSync(raw);
    } catch(e) {
      try { stream = zlib.inflateRawSync(raw); } catch(e2) { stream = raw; }
    }
  }
  return { header, stream };
}

let pageAnalysis = [];

for (let p = 0; p < pages.length; p++) {
  let pageObj = pages[p];
  // extract /Contents
  let contentMatch = pageObj.data.match(/\/Contents\s+(\d+)\s+0\s+R/);
  let contents = null;
  let hasText = false;
  let hasImages = false;
  let text = '';
  let imageIds = [];

  if (contentMatch) {
    let contentId = parseInt(contentMatch[1]);
    let cObj = getDirectObject(contentId);
    if (cObj && cObj.stream) {
      let str = cObj.stream.toString('binary');
      if (str.includes('BT') && str.includes('ET')) {
        hasText = true;
      }
      // check XObjects invoked in stream: /X... Do
      let doMatches = str.match(/\/([A-Za-z0-9_]+)\s+Do/g);
      if (doMatches) {
        hasImages = true;
      }
    }
  }
  
  // also check page resources for /XObject
  let xMatches = pageObj.data.match(/\/XObject<<([\s\S]*?)>>/);
  if (xMatches) {
    let refs = xMatches[1].match(/\/([A-Za-z0-9_]+)\s+(\d+)\s+0\s+R/g);
    if (refs) {
      refs.forEach(r => imageIds.push(r));
    }
  }

  pageAnalysis.push({
    page: p + 1,
    id: pageObj.id,
    hasText,
    hasImages: imageIds.length > 0 || hasImages,
    imageIds
  });
}

let textPages = pageAnalysis.filter(p => p.hasText).length;
let imagePages = pageAnalysis.filter(p => p.hasImages).length;
console.log(`Summary of 120 pages:`);
console.log(`Pages with text streams: ${textPages}`);
console.log(`Pages with XObject/Images: ${imagePages}`);
console.log('Sample pages analysis (first 10):');
console.log(pageAnalysis.slice(0, 10));
