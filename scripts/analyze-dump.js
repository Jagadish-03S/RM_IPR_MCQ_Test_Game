const fs = require('fs');

for (let i = 0; i < 7; i++) {
  const content = fs.readFileSync(`scripts/dump/objstm_${i}.txt`, 'utf-8');
  console.log(`=== ObjStm ${i} (length: ${content.length}) ===`);
  // Look for /Type /Page, /Type /Catalog, /Count, /Title
  const matches = content.match(/\/Type\s*\/[A-Za-z0-9]+/g);
  console.log('Types found:', [...new Set(matches)]);
  if (content.includes('/Count')) {
    const countMatches = content.match(/\/Count\s+\d+/g);
    console.log('Counts:', countMatches);
  }
}
