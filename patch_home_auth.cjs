const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldLink = `<Link to="/create-tripboard" className="inline-flex items-center justify-center gap-2 text-white font-black bg-blue-600 px-6 py-3 border-4 border-[#0A0A0A] rounded-xl hover:-translate-y-1 hover:translate-x-1 transition-transform shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] whitespace-nowrap">
                Upload Your Tripboard
              </Link>`;

const newBtn = `<button onClick={() => requireAuth(() => navigate('/create-tripboard'))} className="inline-flex items-center justify-center gap-2 text-white font-black bg-blue-600 px-6 py-3 border-4 border-[#0A0A0A] rounded-xl hover:-translate-y-1 hover:translate-x-1 transition-transform shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] whitespace-nowrap cursor-pointer">
                Upload Your Tripboard
              </button>`;

if (content.includes(oldLink)) {
    content = content.replace(oldLink, newBtn);
    fs.writeFileSync('src/pages/Home.tsx', content);
    console.log("Patched Home.tsx");
} else {
    console.log("Failed to find link in Home.tsx");
}
