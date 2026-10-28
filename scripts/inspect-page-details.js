const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));

// Find object by ID in buffer
function findObject(objId) {
  let searchStr = `\n${objId} 0 obj`;
  let idx = buffer.indexOf(searchStr);
  if (idx === -1) {
    searchStr = `${objId} 0 obj`;
    idx = buffer.indexOf(searchStr);
  }
  if (idx === -1) return null;
  
  // Find stream or endobj
  let streamIdx = buffer.indexOf('stream', idx);
  let endobjIdx = buffer.indexOf('endobj', idx);
  
  let header = buffer.subarray(idx, (streamIdx !== -1 && streamIdx < endobjIdx) ? streamIdx : endobjIdx).toString('binary');
  
  let stream = null;
  if (streamIdx !== -1 && streamIdx < endobjIdx) {
    let sStart = streamIdx + 6;
    if (buffer[sStart] === 13) sStart++;
    if (buffer[sStart] === 10) sStart++;
    let endstreamIdx = buffer.indexOf('endstream', sStart);
    let rawStream = buffer.subarray(sStart, endstreamIdx);
    try {
      stream = zlib.inflateSync(rawStream);
    } catch(e) {
      try { stream = zlib.inflateRawSync(rawStream); } catch(e2) { stream = rawStream; }
    }
  }
  return { header, stream };
}

console.log('Inspecting Page 1 Contents (577):');
let c1 = findObject(577);
if (c1) {
  console.log('Header:', c1.header);
  if (c1.stream) console.log('Stream length:', c1.stream.length, 'Stream text:', c1.stream.toString('binary').substring(0, 300));
}

console.log('\nInspecting Page 1 XObject X1 (578):');
let x1 = findObject(578);
if (x1) {
  console.log('Header:', x1.header);
  if (x1.stream) console.log('Stream length:', x1.stream.length);
}

console.log('\nInspecting Page 2 Contents (2):');
let c2 = findObject(2);
if (c2) {
  console.log('Header:', c2.header);
  if (c2.stream) console.log('Stream length:', c2.stream.length, 'Stream text:', c2.stream.toString('binary').substring(0, 300));
}
