const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const pdfPath = path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf');
const buffer = fs.readFileSync(pdfPath);

let idx = 0;
let objStreams = [];
while ((idx = buffer.indexOf('/ObjStm', idx)) !== -1) {
  let streamStart = buffer.indexOf('stream', idx);
  let streamEnd = buffer.indexOf('endstream', streamStart);
  if (streamStart !== -1 && streamEnd !== -1) {
    let sStart = streamStart + 6;
    if (buffer[sStart] === 13) sStart++;
    if (buffer[sStart] === 10) sStart++;
    let slice = buffer.subarray(sStart, streamEnd);
    try {
      let decomp = zlib.inflateSync(slice);
      objStreams.push(decomp);
    } catch(e) {
      try {
        let decomp = zlib.inflateRawSync(slice);
        objStreams.push(decomp);
      } catch(e2) {}
    }
  }
  idx += 7;
}

// Write decompressed objStreams to files so we can inspect them
if (!fs.existsSync('scripts/dump')) fs.mkdirSync('scripts/dump');
objStreams.forEach((decomp, i) => {
  fs.writeFileSync(`scripts/dump/objstm_${i}.txt`, decomp);
});

console.log('Saved', objStreams.length, 'ObjStreams to scripts/dump/');
