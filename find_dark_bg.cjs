const fs = require('fs');
const content = fs.readFileSync('src/views/LandingPage.tsx', 'utf8');
const lines = content.split('\n');

const darkPatterns = [
  /bg-\[#(0[0-9a-f]{5}|1[0-1][0-9a-f]{4})/i,
  /from-\[#(0[0-9a-f]{5}|1[0-1][0-9a-f]{4})/i,
  /to-\[#(0[0-9a-f]{5}|1[0-1][0-9a-f]{4})/i,
  /via-\[#(0[0-9a-f]{5}|1[0-1][0-9a-f]{4})/i,
  /bg-slate-950/,
  /bg-slate-900/,
  /bg-black/,
  /from-black/,
  /to-black/,
  /bg-sky-950/
];

lines.forEach((line, idx) => {
  for (const p of darkPatterns) {
    if (p.test(line)) {
      console.log(`Line ${idx+1}: ${line.trim().slice(0, 110)}`);
      break;
    }
  }
});
