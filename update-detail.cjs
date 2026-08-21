const fs = require('fs');
let code = fs.readFileSync('src/pages/TripboardDetail.tsx', 'utf8');

// Replace day.image with day.image_urls mapping
const oldDayImage = `{day.image && (
                    <div className="mb-4 rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
                      <img src={day.image} alt={day.title} className="w-full h-auto object-cover max-h-80" />
                    </div>
                  )}`;
const newDayImage = `{day.image_urls && day.image_urls.length > 0 && (
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {day.image_urls.map((imgUrl: string, idx: number) => (
                        <div key={idx} className="rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <img src={imgUrl} alt={\`\${day.title} photo \${idx + 1}\`} className="w-full h-auto object-cover max-h-80" />
                        </div>
                      ))}
                    </div>
                  )}`;
code = code.replace(oldDayImage, newDayImage);

// Replace stay.image with stay.image_urls
const oldStayImage = `{stay.image && (
                    <div className="mb-3 rounded-lg border-2 border-black overflow-hidden w-full h-40">
                      <img src={stay.image} alt={stay.name} className="w-full h-full object-cover" />
                    </div>
                  )}`;
const newStayImage = `{stay.image_urls && stay.image_urls.length > 0 && (
                    <div className="mb-3 rounded-lg border-2 border-black overflow-hidden w-full h-40 relative">
                      <img src={stay.image_urls[0]} alt={stay.name} className="w-full h-full object-cover" />
                      {stay.image_urls.length > 1 && (
                         <div className="absolute bottom-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">+{stay.image_urls.length - 1}</div>
                      )}
                    </div>
                  )}`;
code = code.replace(oldStayImage, newStayImage);

// Replace food.image with food.image_urls
const oldFoodImage = `{f.image && (
                    <div className="mb-3 rounded-lg border-2 border-black overflow-hidden w-full h-40">
                      <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                  )}`;
const newFoodImage = `{f.image_urls && f.image_urls.length > 0 && (
                    <div className="mb-3 rounded-lg border-2 border-black overflow-hidden w-full h-40 relative">
                      <img src={f.image_urls[0]} alt={f.name} className="w-full h-full object-cover" />
                      {f.image_urls.length > 1 && (
                         <div className="absolute bottom-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">+{f.image_urls.length - 1}</div>
                      )}
                    </div>
                  )}`;
code = code.replace(oldFoodImage, newFoodImage);

fs.writeFileSync('src/pages/TripboardDetail.tsx', code);
console.log("Updated TripboardDetail.tsx");

