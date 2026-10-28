const fs = require('fs');
const pages = JSON.parse(fs.readFileSync('scripts/dump/all_120_pages.json'));

[14, 18, 19, 20, 21].forEach(pNum => {
  let p = pages[pNum - 1];
  console.log(`Page ${pNum} (id ${p.id}):`, p.data);
});
