const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const pdfPath = path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf');
const buffer = fs.readFileSync(pdfPath);

const xrefOffset = 56514053;
const slice = buffer.subarray(xrefOffset, xrefOffset + 2000);
console.log('Xref header:', slice.toString('binary').substring(0, 500));

// Find stream and endstream
const streamStart = slice.indexOf('stream');
const streamEnd = slice.indexOf('endstream');
if (streamStart !== -1 && streamEnd !== -1) {
  let sStart = xrefOffset + streamStart + 6;
  if (buffer[sStart] === 13) sStart++;
  if (buffer[sStart] === 10) sStart++;
  let sEnd = xrefOffset + streamEnd;
  let compressed = buffer.subarray(sStart, sEnd);
  try {
    let uncompressed = zlib.inflateSync(compressed);
    console.log('Uncompressed xref stream length:', uncompressed.length);
  } catch(e) {
    console.log('Decompress error:', e.message);
  }
}
