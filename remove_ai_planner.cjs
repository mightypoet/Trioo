const fs = require('fs');

function replaceInFile(file, oldStr, newStr) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.split(oldStr).join(newStr);
  fs.writeFileSync(file, code);
}

replaceInFile('src/components/layout/Navbar.tsx', 'to="/ai-planner"', 'to="/"');
replaceInFile('src/components/layout/BottomNav.tsx', 'to="/ai-planner"', 'to="/"');
replaceInFile('src/pages/Home.tsx', 'to="/ai-planner"', 'to="/"');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/import AiTripPlanner from '\.\/pages\/AiTripPlanner';\n/, '');
appCode = appCode.replace(/<Route path="ai-planner" element=\{<AiTripPlanner \/>\} \/>\n/, '');
fs.writeFileSync('src/App.tsx', appCode);

// Delete AiTripPlanner.tsx just to clean up (optional, but good practice since it's eliminated)
try {
  fs.unlinkSync('src/pages/AiTripPlanner.tsx');
} catch (e) {}

