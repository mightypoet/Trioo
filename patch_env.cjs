const fs = require('fs');
let env = fs.readFileSync('.env.example', 'utf8');
if (!env.includes('AVIATIONSTACK_API_KEY')) {
  fs.writeFileSync('.env.example', env + '\nAVIATIONSTACK_API_KEY=\n');
}
