const fs = require('fs');
let env = fs.readFileSync('.env.example', 'utf8');
if (!env.includes('SCRAPE_DO_API_KEY')) {
  fs.writeFileSync('.env.example', env + '\nSCRAPE_DO_API_KEY=\n');
}
