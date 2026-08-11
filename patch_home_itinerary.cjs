const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldItineraryStr = `                    <div className="space-y-8">
                      {plan?.itinerary?.map((day: any, idx: number) => (
                        <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] last:before:bottom-0 before:w-1 before:bg-[#0A0A0A]">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-yellow-400 border-2 border-[#0A0A0A] rounded-full flex items-center justify-center font-black text-xs z-10">
                            {day.day}
                          </div>
                          <h4 className="text-2xl font-black text-[#0A0A0A] mb-2">{day.title}</h4>
                          <p className="text-gray-700 font-medium leading-relaxed mb-6">
                            {day.description}
                          </p>
                          
                          {day.spots && day.spots.length > 0 && (
                            <div className="space-y-6 mt-4">
                              {day.spots.map((spot: any, spotIdx: number) => (
                                <div key={spotIdx}>
                                  {/* Spot Card */}
                                  <div className="bg-white p-5 rounded-2xl border-4 border-[#0A0A0A] shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="text-xl font-black text-[#0A0A0A] pr-4">{spot.spotName}</h5>
                                      {spot.spotMapUrl && (
                                        <a 
                                          href={spot.spotMapUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="flex-shrink-0 bg-green-400 p-2 rounded-lg border-2 border-[#0A0A0A] hover:bg-green-300 transition-colors shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]"
                                          title="View on Google Maps"
                                        >
                                          <ExternalLink className="w-4 h-4 text-[#0A0A0A]" />
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-gray-600 font-medium text-sm leading-relaxed">
                                      {spot.description}
                                    </p>
                                  </div>
                                  
                                  {/* Transit Card (if not the last spot) */}
                                  {spot.transitToNext && spotIdx < day.spots.length - 1 && (
                                    <div className="ml-8 my-4 relative">
                                      {/* Vertical connection line */}
                                      <div className="absolute -left-8 top-1/2 -mt-px w-8 h-[2px] bg-[#0A0A0A] border-dashed border-t-2" />
                                      
                                      <div className="bg-blue-100 p-3 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="bg-blue-400 p-2 rounded-lg border-2 border-[#0A0A0A]">
                                            <Navigation className="w-4 h-4 text-[#0A0A0A]" />
                                          </div>
                                          <div>
                                            <p className="text-xs font-black text-blue-900 uppercase tracking-wider">{spot.transitToNext.travelMode}</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                              <span>{spot.transitToNext.estimatedDuration}</span>
                                              {spot.transitToNext.estimatedFare && (
                                                <>
                                                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                                                  <span className="text-green-700">{spot.transitToNext.estimatedFare}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {spot.transitToNext.routeMapUrl && (
                                          <a 
                                            href={spot.transitToNext.routeMapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hidden sm:flex items-center gap-1 text-xs font-black bg-white px-3 py-2 rounded-lg border-2 border-[#0A0A0A] hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]"
                                          >
                                            View Route <ArrowRight className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>`;

const newItineraryStr = `                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {plan?.itinerary?.map((day: any, idx: number) => (
                        <div key={idx} className="bg-yellow-100 border-4 border-[#0A0A0A] rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:rotate-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full">
                          <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-2 mb-3">
                            <span className="bg-[#0A0A0A] text-white font-black px-3 py-1 rounded-md text-sm">DAY {day.day}</span>
                          </div>
                          <h4 className="font-bold text-lg mb-3 leading-tight text-[#0A0A0A]">{day.title}</h4>
                          <p className="text-gray-800 text-sm leading-relaxed">{day.description}</p>
                          
                          {day.spots && day.spots.length > 0 && (
                            <div className="space-y-4 mt-6 flex-grow">
                              {day.spots.map((spot: any, spotIdx: number) => (
                                <div key={spotIdx}>
                                  {/* Spot Card */}
                                  <div className="bg-white p-4 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="text-base font-black text-[#0A0A0A] pr-4 leading-tight">{spot.spotName}</h5>
                                      {spot.spotMapUrl && (
                                        <a 
                                          href={spot.spotMapUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="flex-shrink-0 bg-green-400 p-1.5 rounded-md border-2 border-[#0A0A0A] hover:bg-green-300 transition-colors shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]"
                                          title="View on Google Maps"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 text-[#0A0A0A]" />
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-gray-600 font-medium text-xs leading-relaxed">
                                      {spot.description}
                                    </p>
                                  </div>
                                  
                                  {/* Transit Card (if not the last spot) */}
                                  {spot.transitToNext && spotIdx < day.spots.length - 1 && (
                                    <div className="ml-4 my-3 relative">
                                      {/* Vertical connection line */}
                                      <div className="absolute -left-4 top-1/2 -mt-px w-4 h-[2px] bg-[#0A0A0A] border-dashed border-t-2" />
                                      
                                      <div className="bg-blue-100 p-2.5 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="bg-blue-400 p-1.5 rounded-lg border-2 border-[#0A0A0A]">
                                            <Navigation className="w-3.5 h-3.5 text-[#0A0A0A]" />
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider">{spot.transitToNext.travelMode}</p>
                                            <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                                              <span>{spot.transitToNext.estimatedDuration}</span>
                                              {spot.transitToNext.estimatedFare && (
                                                <>
                                                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                                                  <span className="text-green-700">{spot.transitToNext.estimatedFare}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {spot.transitToNext.routeMapUrl && (
                                          <a 
                                            href={spot.transitToNext.routeMapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center bg-white p-1.5 rounded-md border-2 border-[#0A0A0A] hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]"
                                            title="View Route"
                                          >
                                            <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0A]" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>`;

if (code.includes(oldItineraryStr)) {
  code = code.replace(oldItineraryStr, newItineraryStr);
  fs.writeFileSync('src/pages/Home.tsx', code);
  console.log("Replaced itinerary string");
} else {
  console.log("Could not find old itinerary string");
  
  // Try to find a substring to check where it differs
  const startStr = `<div className="space-y-8">`;
  const endStr = `</div>
                      ))}
                    </div>`;
  
  const startIdx = code.indexOf(startStr);
  if (startIdx !== -1) {
    let nextDivCount = 1;
    let currIdx = startIdx + startStr.length;
    while (nextDivCount > 0 && currIdx < code.length) {
       const nextDivOpen = code.indexOf("<div", currIdx);
       const nextDivClose = code.indexOf("</div", currIdx);
       
       if (nextDivOpen !== -1 && nextDivOpen < nextDivClose) {
         nextDivCount++;
         currIdx = nextDivOpen + 4;
       } else if (nextDivClose !== -1) {
         nextDivCount--;
         currIdx = nextDivClose + 5;
       } else {
         break;
       }
    }
    
    if (nextDivCount === 0) {
      const block = code.substring(startIdx, currIdx + 1); // get the whole block
      code = code.replace(block, newItineraryStr);
      fs.writeFileSync('src/pages/Home.tsx', code);
      console.log("Replaced itinerary block dynamically");
    }
  }
}

