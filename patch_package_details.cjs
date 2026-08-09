const fs = require('fs');

const current = fs.readFileSync('src/pages/PackageDetails.tsx', 'utf8');

// Replace the dotted path and map
const oldString = `{/* Dotted path connecting the days */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 md:w-2 border-l-4 md:border-l-8 border-dashed border-[#0A0A0A] -translate-x-1/2 opacity-30"></div>
                
                {trip.itineraries?.map((itinerary: any, index: number) => {
                  const isEven = index % 2 === 0;
                  const emojis = ['🎒', '📸', '🗺️', '⛰️', '✈️', '🌴', '🍹', '🚕', '🎟️', '🛌'];
                  const emoji = emojis[index % emojis.length];
                  return (
                    <div key={itinerary.id} className={\`relative flex items-center mb-16 md:mb-24 \${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row\`}>
                      
                      {/* Timeline Node */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20"> 
                         <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--color-primary)] border-4 border-[#0A0A0A] flex flex-col items-center justify-center rotate-3 transition-transform hover:scale-110" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }}>
                            <span className="text-[10px] md:text-xs font-black uppercase leading-none">Day</span>
                            <span className="text-xl md:text-2xl font-black leading-none">{itinerary.day_number}</span>
                         </div>
                      </div>

                      {/* Card */}
                      <div className={\`w-[calc(100%-4rem)] ml-16 md:ml-0 md:w-1/2 \${isEven ? 'md:pr-16 md:text-left' : 'md:pl-16 md:text-right'}\`}>
                        <div className="bg-white p-5 md:p-8 border-4 border-[#0A0A0A] rounded-2xl relative group hover:-translate-y-2 hover:translate-x-2 transition-all duration-300" style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}>
                           
                           {/* Desktop Emoji Badge */}
                           <div className={\`absolute -top-6 md:-top-10 \${isEven ? '-left-6 md:-left-10' : '-right-6 md:-right-10'} w-16 h-16 md:w-24 md:h-24 bg-[var(--color-secondary)] border-4 border-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] rounded-2xl hidden md:flex items-center justify-center text-4xl md:text-5xl \${isEven ? 'rotate-[-10deg]' : 'rotate-[10deg]'} transition-transform group-hover:rotate-0 group-hover:scale-110 z-10\`}>
                             {emoji}
                           </div>
                           
                           {/* Mobile Emoji Badge */}
                           <div className="md:hidden w-12 h-12 mb-3 bg-[var(--color-secondary)] rounded-xl border-4 border-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex items-center justify-center text-2xl -rotate-3">
                             {emoji}
                           </div>

                           <h4 className="font-black text-lg md:text-2xl mb-2 md:mb-3 leading-tight text-gray-900">{itinerary.title}</h4>
                           <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed">{itinerary.detailed_description}</p>
                        </div>
                      </div>
                      
                    </div>
                  );
                })}

                {/* X marks the spot */}
                {trip.itineraries && trip.itineraries.length > 0 && (
                  <div className="relative flex items-center justify-center mt-20 md:mt-24"> 
                     <div className="w-24 h-24 md:w-32 md:h-32 rotate-6 hover:rotate-0 hover:scale-110 transition-transform cursor-pointer z-20">
                        <img 
                          src="https://placehold.co/400x400/4ADE80/0A0A0A.png?text=3D+Treasure+Chest&font=montserrat" 
                          alt="3D isometric treasure chest"
                          className="w-full h-full object-cover rounded-2xl border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]"
                        />
                     </div>
                  </div>
                )}

                {(!trip.itineraries || trip.itineraries.length === 0) && (
                  <p className="text-gray-500 font-bold text-center mt-12">No treasure map details provided yet.</p>
                )}`;

const parsedItineraryBlock = `const parsedItinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : (trip.itinerary || trip.itineraries);
const safeItinerary = Array.isArray(parsedItinerary) ? parsedItinerary : [];
`;

console.log(current.includes("{/* Dotted path connecting the days */}"));

