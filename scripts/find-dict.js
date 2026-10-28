const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));

// Let's find all ObjStm stream dictionaries
let idx = 0;
while ((idx = buffer.indexOf('/ObjStm', idx)) !== -1) {
  let objStart = buffer.lastIndexOf('obj', idx);
  let dict = buffer.subarray(objStart - 20, idx + 100).toString('binary');
  console.log('ObjStm dict:', dict.replace(/[\r\n]+/g, ' '));
  idx += 7;
}
