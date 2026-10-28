const fs = require('fs');

const raw = fs.readFileSync('scripts/dump/objstm_4.txt', 'binary');
const N = 120;
const first = 1112;

const headerStr = raw.substring(0, first).trim();
const tokens = headerStr.split(/\s+/).map(Number);

console.log('Total tokens in header:', tokens.length, 'expected:', N * 2);

const objects = [];
for (let i = 0; i < tokens.length; i += 2) {
  let id = tokens[i];
  let offset = tokens[i + 1];
  let nextOffset = (i + 2 < tokens.length) ? tokens[i + 3] : (raw.length - first);
  let data = raw.substring(first + offset, first + nextOffset).trim();
  objects.push({ id, offset, data });
}

console.log('Successfully extracted', objects.length, 'page objects!');
console.log('Page 1 (first page):', objects[0]);
console.log('Page 2 (second page):', objects[1]);
console.log('Page 3 (third page):', objects[2]);

fs.writeFileSync('scripts/dump/all_120_pages.json', JSON.stringify(objects, null, 2));
