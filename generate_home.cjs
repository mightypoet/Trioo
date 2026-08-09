const fs = require('fs');

const current = fs.readFileSync('src/pages/Home.tsx', 'utf8');
const imports = current.match(/import .+/g).join('\n');
console.log(imports);
