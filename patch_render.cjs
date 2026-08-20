const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Update Itinerary Google Maps Link
const itineraryOld = `                          <h4 className="font-bold text-lg mb-3 leading-tight text-[#0A0A0A]">{day.title}</h4>
                          <p className="text-gray-800 text-sm leading-relaxed">{day.description}</p>`;
                          
const itineraryNew = `                          <h4 className="font-bold text-lg mb-3 leading-tight text-[#0A0A0A]">{day.title}</h4>
                          <p className="text-gray-800 text-sm leading-relaxed mb-4">{day.description}</p>
                          {day.googleMapsSearchLink && (
                            <a href={day.googleMapsSearchLink} target="_blank" rel="noopener noreferrer" className="mt-auto self-start inline-flex items-center gap-2 bg-white border-2 border-black rounded-lg px-3 py-2 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                              📍 View on Map
                            </a>
                          )}`;
code = code.replace(itineraryOld, itineraryNew);

// 2. We'll replace the side column containing Transportation and Budget Breakdown entirely to fit the new requirements.
// Let's identify the side column content start.
const sideColumnRegex = /                  <div className="flex flex-col gap-6 md:gap-8">[\s\S]*?                  <\/div>\n                <\/div>\n/m;
// Wait, the structure in Home.tsx is:
// <div className="grid md:grid-cols-3 gap-8">
//   <div className="md:col-span-2 ...">Itinerary</div>
//   <div className="flex flex-col gap-6 md:gap-8">...</div>
// </div>

const sideColumnNew = `                  <div className="flex flex-col gap-6 md:gap-8">
                    
                    {/* Budget Breakdown */}
                    {plan?.budgetBreakdown && (
                      <div className="bg-yellow-300 border-4 border-[#0A0A0A] rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-[#0A0A0A]">
                          <IndianRupee className="w-5 h-5" strokeWidth={3} /> Budget
                        </h3>
                        
                        <div className="bg-green-300 border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 text-center transform -rotate-1 hover:rotate-0 transition-all">
                          <p className="text-xs font-black uppercase mb-1 opacity-70 text-black">Total Group Cost</p>
                          <p className="text-2xl font-black text-black">{plan.budgetBreakdown.totalGroup}</p>
                          {plan.budgetBreakdown.perPerson && <p className="text-sm font-bold text-black mt-2">Per Person: {plan.budgetBreakdown.perPerson}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Hotels', value: plan.budgetBreakdown.accommodation },
                            { label: 'Food', value: plan.budgetBreakdown.food },
                            { label: 'Transport', value: plan.budgetBreakdown.localTransport }
                          ].map((item, idx) => (
                            item.value && (
                              <div key={idx} className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">{item.label}</p>
                                <p className="text-sm font-black text-black leading-tight">{item.value}</p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hotel Suggestions */}
                    {plan?.hotelSuggestions && plan.hotelSuggestions.length > 0 && (
                      <div className="bg-pink-300 border-4 border-[#0A0A0A] rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-[#0A0A0A]">
                          <Hotel className="w-5 h-5" strokeWidth={3} /> Stays
                        </h3>
                        <div className="flex flex-col gap-4">
                          {plan.hotelSuggestions.map((hotel: any, idx: number) => (
                            <div key={idx} className="bg-cyan-200 border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
                              <h4 className="font-black text-base leading-tight mb-1">{hotel.name}</h4>
                              <div className="flex justify-between items-center mb-3">
                                <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black">{hotel.type}</span>
                                <span className="font-bold text-sm text-black">{hotel.estimatedPricePerNight}</span>
                              </div>
                              <a href={hotel.searchLink} target="_blank" rel="noopener noreferrer" className="bg-[#0A0A0A] text-white text-xs font-black py-2 rounded-lg text-center border-2 border-transparent hover:bg-white hover:text-[#0A0A0A] hover:border-[#0A0A0A] transition-all">
                                View Prices
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transportation & Logistics */}
                    {plan?.transportation && (
                      <div className="bg-blue-300 border-4 border-[#0A0A0A] rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-[#0A0A0A]">
                          <Navigation className="w-5 h-5" strokeWidth={3} /> Logistics
                        </h3>
                        
                        {plan.transportation.localAdvice && (
                          <div className="bg-white border-2 border-black rounded-xl p-4 mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-bold text-gray-800 leading-snug italic">
                            💡 {plan.transportation.localAdvice}
                          </div>
                        )}

                        <div className="flex flex-col gap-3">
                          {plan.transportation.flights && (
                            <a href={plan.transportation.flights} target="_blank" rel="noopener noreferrer" className="bg-white p-3 border-2 border-[#0A0A0A] rounded-xl font-bold text-sm text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
                              Search Flights <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          )}
                          {plan.transportation.trains && (
                            <a href={plan.transportation.trains} target="_blank" rel="noopener noreferrer" className="bg-white p-3 border-2 border-[#0A0A0A] rounded-xl font-bold text-sm text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
                              Search Trains <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
`;

if (code.match(sideColumnRegex)) {
  code = code.replace(sideColumnRegex, sideColumnNew);
  fs.writeFileSync('src/pages/Home.tsx', code);
  console.log("Side column replaced!");
} else {
  console.log("Side column regex didn't match.");
}
