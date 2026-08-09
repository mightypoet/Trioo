const fs = require('fs');

let code = fs.readFileSync('src/pages/PackageDetails.tsx', 'utf8');

const highlightsRegex = /<section>\s*<h2 className="text-2xl font-bold mb-4">About this trip<\/h2>[\s\S]*?<\/section>/;

const newHighlights = `
          <section className="bg-white border-4 border-black rounded-2xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-6 uppercase">Agency Specs</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Key Features */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-3">Highlights</h3>
                {(trip.key_features && trip.key_features.length > 0) ? (
                  <ul className="space-y-2">
                    {trip.key_features.map((feature: string, idx: number) => (
                      feature ? (
                        <li key={idx} className="flex items-start gap-2 font-bold text-gray-800">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-black shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ) : null
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 font-bold">Standard features included. Ask the agency for more details.</p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-3 justify-center md:min-w-[200px]">
                <div className={\`px-4 py-3 border-4 border-black font-black uppercase text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl \${trip.food_included ? 'bg-green-400' : 'bg-gray-200 text-gray-500'}\`}>
                  {trip.food_included ? '✓ Meals Included' : '✕ Meals Not Included'}
                </div>
                <div className={\`px-4 py-3 border-4 border-black font-black uppercase text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl \${trip.transit_included ? 'bg-green-400' : 'bg-gray-200 text-gray-500'}\`}>
                  {trip.transit_included ? '✓ Transit Included' : '✕ Transit Not Included'}
                </div>
              </div>
            </div>
          </section>
`;

code = code.replace(highlightsRegex, newHighlights);

const itineraryRegex = /<section>\s*<h2 className="text-3xl font-black mb-8 flex items-center gap-3">[\s\S]*?<\/section>/;

const newItinerary = `
          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <span className="bg-[var(--color-primary)] text-[#0A0A0A] px-3 py-1 border-4 border-[#0A0A0A] rounded-lg shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] -rotate-3">The</span>
              Journey Map
            </h2>
            
            <div className="relative py-12 px-4 md:px-10 bg-[#F9F5EE] border-4 border-[#0A0A0A] rounded-[3rem] overflow-hidden" style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}>
              
              {/* Map Background grid */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#0A0A0A 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              
              <div className="relative z-10">
                {(() => {
                  const parsedItinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : (trip.itinerary || trip.itineraries);
                  const safeItinerary = Array.isArray(parsedItinerary) ? parsedItinerary : [];
                  
                  if (safeItinerary.length === 0) {
                    return (
                      <div className="flex justify-center items-center py-10">
                        <div className="bg-yellow-200 border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] aspect-square max-w-sm flex flex-col items-center justify-center rotate-3 relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-black/80 rotate-[-5deg]"></div>
                          <h3 className="text-2xl font-black text-black mb-2 text-center">:(</h3>
                          <p className="text-lg font-bold text-center">Details coming soon</p>
                        </div>
                      </div>
                    );
                  }

                  const colors = ['bg-yellow-200', 'bg-pink-200', 'bg-cyan-200', 'bg-green-200'];
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-10">
                      {safeItinerary.map((stop: any, index: number) => {
                        const dayNumber = stop.day || stop.day_number || (index + 1);
                        const title = stop.title || stop.name || '';
                        const description = stop.description || stop.detailed_description || '';
                        const color = colors[index % colors.length];
                        
                        // Random rotation between -3 and 3 degrees
                        // Using a deterministic approach based on index so it doesn't jump on re-renders
                        const rotMap = [-2, 3, -1, 2, -3, 1];
                        const rotation = rotMap[index % rotMap.length];
                        
                        return (
                          <div 
                            key={dayNumber} 
                            className={\`\${color} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:rotate-0 transition-all duration-300 relative aspect-square flex flex-col justify-between group\`}
                            style={{ transform: \`rotate(\${rotation}deg)\` }}
                          >
                            {/* Pushpin / Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-black/80 rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"></div>
                            
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <span className="font-black text-2xl uppercase tracking-wider border-b-4 border-black pb-1">Day {dayNumber}</span>
                              </div>
                              <h3 className="text-xl md:text-2xl font-black leading-tight uppercase mb-3 break-words group-hover:text-black/80 transition-colors">
                                {title}
                              </h3>
                            </div>
                            
                            <p className="text-black/80 font-bold text-sm md:text-base leading-relaxed overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {description}
                            </p>

                            {/* Google Maps Link */}
                            {stop.googleMapsLink && (
                              <a 
                                href={stop.googleMapsLink}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-4 self-start inline-block bg-white text-black border-2 border-black font-black px-4 py-2 text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
                              >
                                Maps
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>
`;

code = code.replace(itineraryRegex, newItinerary);

fs.writeFileSync('src/pages/PackageDetails.tsx', code);

