const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const pdfPath = path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf');
const buffer = fs.readFileSync(pdfPath);

// Let's find object streams: /Type/ObjStm or /Type /ObjStm
console.log('Searching for ObjStm...');
let idx = 0;
let objStreams = [];
while ((idx = buffer.indexOf('/ObjStm', idx)) !== -1) {
  // find start of object
  let objStart = buffer.lastIndexOf('obj', idx);
  // find start of stream
  let streamStart = buffer.indexOf('stream', idx);
  let streamEnd = buffer.indexOf('endstream', streamStart);
  if (streamStart !== -1 && streamEnd !== -1) {
    let sStart = streamStart + 6;
    if (buffer[sStart] === 13) sStart++;
    if (buffer[sStart] === 10) sStart++;
    let slice = buffer.subarray(sStart, streamEnd);
    try {
      let decomp = zlib.inflateSync(slice);
      objStreams.push(decomp.toString('binary'));
    } catch(e) {
      try {
        let decomp = zlib.inflateRawSync(slice);
        objStreams.push(decomp.toString('binary'));
      } catch(e2) {}
    }
  }
  idx += 7;
}

console.log('Found decompressed ObjStreams:', objStreams.length);

// Let's search inside the decompressed objStreams for pages, outlines, titles
objStreams.forEach((content, i) => {
  if (content.includes('/Pages') || content.includes('/Count') || content.includes('/Title')) {
    console.log(`--- ObjStream ${i} highlights ---`);
    let lines = content.split(/[\r\n]+/);
    lines.filter(l => l.includes('/Title') || l.includes('/Pages') || l.includes('/Count') || l.includes('/Kids'))
         .slice(0, 10)
         .forEach(l => console.log('  ', l.substring(0, 120)));
  }
});
