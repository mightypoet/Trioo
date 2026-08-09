const fs = require('fs');

let code = fs.readFileSync('src/pages/PackageDetails.tsx', 'utf8');

code = code.replace(
  /const rotMap = \[\-2, 3, \-1, 2, \-3, 1\];[\s\S]*?const rotation = rotMap\[index % rotMap\.length\];[\s\S]*?return \([\s\S]*?<div[\s\S]*?style=\{\{ transform: \`rotate\(\$\{rotation\}deg\)\` \}\}/g,
  `const rotClasses = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-1'];
                        const rotationClass = rotClasses[index % rotClasses.length];
                        
                        return (
                          <div 
                            key={dayNumber} 
                            className={\`\${color} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:rotate-0 transition-all duration-300 relative aspect-square flex flex-col justify-between group \${rotationClass}\`}`
);

fs.writeFileSync('src/pages/PackageDetails.tsx', code);
