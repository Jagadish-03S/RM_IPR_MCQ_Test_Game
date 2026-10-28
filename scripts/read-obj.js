const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));

function inspectObj(id, offset) {
  let slice = buffer.subarray(offset, offset + 500).toString('binary');
  let streamIdx = slice.indexOf('stream');
  console.log(`Obj ${id} header:`, slice.substring(0, streamIdx));
  let sStart = offset + streamIdx + 6;
  if (buffer[sStart] === 13) sStart++;
  if (buffer[sStart] === 10) sStart++;
  let bytes = buffer.subarray(sStart, sStart + 10);
  console.log(`Obj ${id} first stream bytes:`, Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
}

inspectObj(579, 56144502);
inspectObj(4, 14957);
inspectObj(8, 848);
