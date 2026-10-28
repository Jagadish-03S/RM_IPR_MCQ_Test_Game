const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const pdfPath = path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf');
const buffer = fs.readFileSync(pdfPath);

// Let's search for objects: \d+ \d+ obj
console.log('PDF Length:', buffer.length);

// Let's scan for objects and their dictionary headers
const str = buffer.toString('binary');
const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
let match;
let count = 0;
let objectTypes = {};
let pages = [];
let info = null;

// Find all objects
let objMap = new Map();
let objHeaderRegex = /(\d+)\s+(\d+)\s+obj\s*<<([\s\S]*?)>>/g;

while ((match = objHeaderRegex.exec(str)) !== null) {
  const objNum = match[1];
  const dict = match[3];
  
  if (dict.includes('/Type /Page') || dict.includes('/Type/Page')) {
    pages.push(objNum);
  }
  if (dict.includes('/Title') || dict.includes('/Author')) {
    info = dict;
  }
}

console.log('Total /Type /Page objects found:', pages.length);
if (info) {
  console.log('Doc Info dict:', info.replace(/[\r\n]+/g, ' '));
}

// Let's check if there's an XRef stream or linearized PDF
let startXrefIdx = buffer.lastIndexOf('startxref');
console.log('startXrefIdx:', startXrefIdx);
if (startXrefIdx !== -1) {
  console.log('Trailer area:', buffer.subarray(startXrefIdx, startXrefIdx + 200).toString('binary'));
}
