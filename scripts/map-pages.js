const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));
const pages = JSON.parse(fs.readFileSync('scripts/dump/all_120_pages.json'));

const outDir = 'scripts/dump/pages';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pageMap = [];

for (let i = 0; i < pages.length; i++) {
  let p = pages[i];
  let x2Match = p.data.match(/\/X2\s+(\d+)\s+0\s+R/);
  if (!x2Match) {
    // maybe /X1 is the main image?
    let x1Match = p.data.match(/\/X1\s+(\d+)\s+0\s+R/);
    x2Match = x1Match;
  }
  
  if (x2Match) {
    let imgId = parseInt(x2Match[1]);
    let search = `${imgId} 0 obj`;
    let idx = buffer.indexOf(search);
    if (idx !== -1) {
      let streamIdx = buffer.indexOf('stream', idx);
      let sStart = streamIdx + 6;
      if (buffer[sStart] === 13) sStart++;
      if (buffer[sStart] === 10) sStart++;
      
      // find Length in header
      let header = buffer.subarray(idx, streamIdx).toString('binary');
      let lenMatch = header.match(/\/Length\s+(\d+)/);
      let len = lenMatch ? parseInt(lenMatch[1]) : 0;
      
      let imgBytes = buffer.subarray(sStart, sStart + len);
      
      pageMap.push({
        pageNumber: i + 1,
        pageObjId: p.id,
        imgObjId: imgId,
        length: len,
        isJpeg: imgBytes[0] === 0xff && imgBytes[1] === 0xd8
      });
      
      // Write sample pages to disk
      if (i < 15 || i === 25 || i === 50 || i === 75 || i === 100 || i === 119) {
        fs.writeFileSync(path.join(outDir, `page_${i + 1}.jpg`), imgBytes);
      }
    }
  }
}

console.log('Mapped pages count:', pageMap.length);
console.log('Sample mapped pages:');
console.log(pageMap.slice(0, 5));
fs.writeFileSync('scripts/dump/page_map.json', JSON.stringify(pageMap, null, 2));
