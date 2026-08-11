const fs = require('fs');
let code = fs.readFileSync('src/pages/GoSolo.tsx', 'utf8');
code = code.replace("import { useState } from 'react';", "import React, { useState } from 'react';");
fs.writeFileSync('src/pages/GoSolo.tsx', code);
