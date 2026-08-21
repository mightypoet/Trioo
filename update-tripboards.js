const fs = require('fs');

let content = fs.readFileSync('src/pages/Tripboards.tsx', 'utf8');

content = content.replace("const tripboards = [\n  { id: 1", `
// mock data removed
const _dummy = [\n  { id: 1`);

// I'll just rewrite the whole file using cat.
