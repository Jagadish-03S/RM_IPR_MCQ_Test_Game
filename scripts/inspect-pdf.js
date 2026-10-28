const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const pdfPath = path.resolve('textbook', 'BRMK557 RM&IPR Textbook.pdf');
console.log('Reading:', pdfPath);

if (!fs.existsSync(pdfPath)) {
  console.error('File not found:', pdfPath);
  process.exit(1);
}

const buffer = fs.readFileSync(pdfPath);
console.log('PDF size in bytes:', buffer.length);

// Scan for basic PDF markers
const str = buffer.toString('binary');
console.log('PDF Header:', str.substring(0, 20));

// Count pages (/Type /Page or /Type/Page)
const pageMatches = str.match(/\/Type\s*\/Page[^s]/g);
console.log('Approximate page count (/Type /Page matches):', pageMatches ? pageMatches.length : 0);

// Look for text streams
let streamCount = 0;
let textFragments = [];
let regex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
let match;

let streamIndices = [];
let idx = 0;
while ((idx = buffer.indexOf('stream', idx)) !== -1) {
  // check if preceding is newline or whitespace
  let endIdx = buffer.indexOf('endstream', idx);
  if (endIdx !== -1) {
    streamIndices.push({ start: idx + 6, end: endIdx });
    idx = endIdx + 9;
  } else {
    break;
  }
}

console.log('Found total streams in PDF:', streamIndices.length);

let textExtractCount = 0;
let sampleText = [];

for (let i = 0; i < streamIndices.length; i++) {
  let { start, end } = streamIndices[i];
  // skip \r or \n
  if (buffer[start] === 13) start++;
  if (buffer[start] === 10) start++;

  let slice = buffer.subarray(start, end);
  let decompressed = null;

  try {
    decompressed = zlib.inflateSync(slice);
  } catch (e) {
    try {
      decompressed = zlib.inflateRawSync(slice);
    } catch (e2) {
      // not flate encoded or raw text
      decompressed = slice;
    }
  }

  if (decompressed) {
    let content = decompressed.toString('utf-8');
    // check if it contains text operator like Tj or TJ or BT
    if (content.includes('BT') && content.includes('ET')) {
      textExtractCount++;
      // Extract text in parentheses (text) Tj or [(t)(e)(x)(t)] TJ
      let matches = content.match(/\((.*?)\)\s*Tj/g);
      if (matches && matches.length > 0) {
        let extracted = matches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
        if (extracted.length > 20 && sampleText.length < 25) {
          sampleText.push(`Stream ${i}: ` + extracted.substring(0, 150));
        }
      }
      let tjArrayMatches = content.match(/\[(.*?)\]\s*TJ/g);
      if (tjArrayMatches && tjArrayMatches.length > 0) {
        let extractedArray = tjArrayMatches.map(m => {
          let inner = m.match(/\((.*?)\)/g);
          return inner ? inner.map(x => x.slice(1, -1)).join('') : '';
        }).join(' ');
        if (extractedArray.length > 20 && sampleText.length < 25) {
          sampleText.push(`Stream ${i} (TJ): ` + extractedArray.substring(0, 150));
        }
      }
    }
  }
}

console.log('Text-bearing streams found:', textExtractCount);
console.log('Sample extracted text passages:');
sampleText.forEach(s => console.log(' -', s));
