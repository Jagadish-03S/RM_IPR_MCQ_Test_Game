const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));
const pages = JSON.parse(fs.readFileSync('scripts/dump/all_120_pages.json'));

// Look at first 5 pages' X2 objects
for (let i = 0; i < 5; i++) {
  let p = pages[i];
  let x2Match = p.data.match(/\/X2\s+(\d+)\s+0\s+R/);
  if (x2Match) {
    let id = x2Match[1];
    let search = `\n${id} 0 obj`;
    let idx = buffer.indexOf(search);
    if (idx !== -1) {
      let streamIdx = buffer.indexOf('stream', idx);
      let header = buffer.subarray(idx, streamIdx).toString('binary');
      let sStart = streamIdx + 6;
      if (buffer[sStart] === 13) sStart++;
      if (buffer[sStart] === 10) sStart++;
      let endstreamIdx = buffer.indexOf('endstream', sStart);
      let imgBytes = buffer.subarray(sStart, endstreamIdx);
      console.log(`Page ${i + 1} Image Obj ${id}:`);
      console.log('  Header:', header.replace(/[\r\n]+/g, ' '));
      console.log('  Image bytes length:', imgBytes.length, 'JPEG SOI:', imgBytes[0].toString(16), imgBytes[1].toString(16));
    }
  }
}
