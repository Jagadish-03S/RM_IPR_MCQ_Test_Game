const fs = require('fs');
const path = require('path');

const buffer = fs.readFileSync(path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf'));
const bufStr = buffer.toString('binary');

console.log('Index of "579 0 obj":', bufStr.indexOf('579 0 obj'));
console.log('Index of "4 0 obj":', bufStr.indexOf('4 0 obj'));
console.log('Index of "8 0 obj":', bufStr.indexOf('8 0 obj'));
