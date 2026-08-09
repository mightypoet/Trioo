const fs = require('fs');
let current = fs.readFileSync('src/pages/PackageDetails.tsx', 'utf8');

const regexToReplace = /\{\/\* Dotted path connecting the days \*\/\}[\s\S]*?\{\(!trip\.itineraries \|\| trip\.itineraries\.length === 0\) && \(\s*<p.*?No treasure map details provided yet\.*?<\/p>\s*\)\}/;

const newBlock = `
                {(() => {
                  const parsedItinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : (trip.itinerary || trip.itineraries);
                  const safeItinerary = Array.isArray(parsedItinerary) ? parsedItinerary : [];
                  
                  return (
                    <div className="relative w-full overflow-visible px-2">
                      <div className="absolute left-[2.25rem] md:left-[2.75rem] top-10 bottom-4 w-0 border-l-4 border-dashed border-black z-0"></div>
                      
                      {safeItinerary.map((stop: any, index: number) => {
                        const dayNumber = stop.day || stop.day_number || (index + 1);
                        const title = stop.title || stop.name || '';
                        const description = stop.description || stop.detailed_description || '';
                        
                        return (
                          <div key={dayNumber} className="relative flex items-start gap-3 md:gap-6 mb-8 w-full">
                            {/* 3D Map Pin Node */}
                            <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 shrink-0 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black mt-2">
                              <span className="font-black text-sm md:text-lg">D{dayNumber}</span>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 min-w-0 bg-white border-4 border-black rounded-2xl p-4 md:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                              <h3 className="text-lg md:text-xl font-black mb-2 uppercase break-words leading-tight">{title}</h3>
                              <p className="text-gray-700 font-medium mb-4 text-sm md:text-base leading-relaxed">
                                {description}
                              </p>
                              
                              {/* Google Maps Link */}
                              {stop.googleMapsLink && (
                                <a 
                                  href={stop.googleMapsLink}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black font-bold px-3 py-2 md:px-4 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-transform text-xs md:text-sm whitespace-nowrap"
                                >
                                  Open in Maps
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* X marks the spot */}
                      {safeItinerary.length > 0 && (
                        <div className="relative flex items-center justify-center mt-20 md:mt-24"> 
                           <div className="w-24 h-24 md:w-32 md:h-32 rotate-6 hover:rotate-0 hover:scale-110 transition-transform cursor-pointer z-20">
                              <img 
                                src="https://placehold.co/400x400/4ADE80/0A0A0A.png?text=3D+Treasure+Chest&font=montserrat" 
                                alt="3D isometric treasure chest"
                                className="w-full h-full object-cover rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]"
                              />
                           </div>
                        </div>
                      )}

                      {safeItinerary.length === 0 && (
                        <p className="text-gray-500 font-bold text-center mt-12">No treasure map details provided yet.</p>
                      )}
                    </div>
                  );
                })()}`;

current = current.replace(regexToReplace, newBlock);
fs.writeFileSync('src/pages/PackageDetails.tsx', current);
