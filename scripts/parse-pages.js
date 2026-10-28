const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const objstm4 = fs.readFileSync('scripts/dump/objstm_4.txt', 'binary');
const objstm5 = fs.readFileSync('scripts/dump/objstm_5.txt', 'binary');

console.log('ObjStm 4 length:', objstm4.length);

// In an ObjStm, the first line is N pairs of integers: <objNum> <offset>
// then at the first offset begins the object data!
// Let's parse the index pairs
function parseObjStm(raw) {
  // Find where the numbers end and the first object starts
  // The stream dictionary has /First <offset>, but we can find the first '<' or '[' or '/'
  let headerMatch = raw.match(/^(\s*\d+\s+\d+)+/);
  if (!headerMatch) return [];
  
  let headerStr = headerMatch[0].trim();
  let tokens = headerStr.split(/\s+/).map(Number);
  let pairs = [];
  for (let i = 0; i < tokens.length; i += 2) {
    pairs.push({ id: tokens[i], offset: tokens[i + 1] });
  }
  
  // Now extract each object
  let firstOffset = pairs[0].offset;
  let objects = [];
  for (let i = 0; i < pairs.length; i++) {
    let start = firstOffset + pairs[i].offset;
    let end = (i + 1 < pairs.length) ? (firstOffset + pairs[i + 1].offset) : raw.length;
    let objData = raw.substring(start, end).trim();
    objects.push({ id: pairs[i].id, data: objData });
  }
  return objects;
}

let pageObjs = parseObjStm(objstm4);
console.log('Total objects parsed in ObjStm 4:', pageObjs.length);
console.log('Sample Page Object (first):', pageObjs[0]);
console.log('Sample Page Object (second):', pageObjs[1]);
