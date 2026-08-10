const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const importRegex = /import \{ (.*?) \} from 'lucide-react';/;
code = code.replace(importRegex, "import { $1, ExternalLink, IndianRupee, Car, Train, Walking, CheckCircle2 } from 'lucide-react';");

const oldItineraryStr = `
                    <div className="space-y-6">
                      {plan?.itinerary?.map((day: any, idx: number) => (
                        <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-[-24px] last:before:bottom-0 before:w-1 before:bg-gray-300">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-yellow-400 border-2 border-[#0A0A0A] rounded-full flex items-center justify-center font-black text-xs">
                            {day.day}
                          </div>
                          <h4 className="text-xl font-bold text-[#0A0A0A] mb-2">{day.title}</h4>
                          <p className="text-gray-700 font-medium leading-relaxed bg-white p-4 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                            {day.description}
                          </p>
                        </div>
                      ))}
                    </div>
`;

const newItineraryStr = `
                    <div className="space-y-8">
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
                    </div>
`;

code = code.replace(oldItineraryStr, newItineraryStr);


const transportStr = `
                  {/* Transportation */}
                  <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                      <Navigation className="w-6 h-6 text-blue-500" strokeWidth={3} />
                      Transport
                    </h3>
                    <div className="space-y-4">
                      {plan?.transportation?.train_link && (
                        <a href={plan?.transportation?.train_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                          Train Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </a>
                      )}
                      {plan?.transportation?.flight_link && (
                        <a href={plan?.transportation?.flight_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                          Flight Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </a>
                      )}
                      {plan?.transportation?.irctc_portal && (
                        <a href={plan?.transportation?.irctc_portal} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                          IRCTC Portal <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </a>
                      )}
                      {!plan?.transportation?.train_link && !plan?.transportation?.flight_link && !plan?.transportation?.irctc_portal && (
                        <p className="text-gray-500 font-medium italic">No transport links generated.</p>
                      )}
                    </div>
                  </div>
`;

const transportAndBudgetStr = `
                  <div className="flex flex-col gap-8">
                    {/* Transportation */}
                    <div className="bg-white border-4 border-[#0A0A0A] rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                      <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                        <Navigation className="w-6 h-6 text-blue-500" strokeWidth={3} />
                        Transport Links
                      </h3>
                      <div className="space-y-4">
                        {plan?.transportation?.train_link && (
                          <a href={plan?.transportation?.train_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                            Train Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </a>
                        )}
                        {plan?.transportation?.flight_link && (
                          <a href={plan?.transportation?.flight_link} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                            Flight Options <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </a>
                        )}
                        {plan?.transportation?.irctc_portal && (
                          <a href={plan?.transportation?.irctc_portal} target="_blank" rel="noopener noreferrer" className="block p-4 border-2 border-[#0A0A0A] rounded-xl font-bold text-[#0A0A0A] hover:bg-yellow-50 transition-colors flex justify-between items-center group">
                            IRCTC Portal <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </a>
                        )}
                        {!plan?.transportation?.train_link && !plan?.transportation?.flight_link && !plan?.transportation?.irctc_portal && (
                          <p className="text-gray-500 font-medium italic">No transport links generated.</p>
                        )}
                      </div>
                    </div>

                    {/* Budget Breakdown */}
                    {plan?.budgetBreakdown && (
                      <div className="bg-yellow-300 border-4 border-[#0A0A0A] rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-[#0A0A0A]">
                          <IndianRupee className="w-6 h-6" strokeWidth={3} />
                          Budget Estimate
                        </h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Accommodation', value: plan.budgetBreakdown.accommodation, icon: Home },
                            { label: 'Local Transport', value: plan.budgetBreakdown.localTransport, icon: Navigation },
                            { label: 'Food & Dining', value: plan.budgetBreakdown.foodAndDining, icon: Flame },
                            { label: 'Activities', value: plan.budgetBreakdown.entryFeesAndActivities, icon: Star },
                            { label: 'Miscellaneous', value: plan.budgetBreakdown.miscellaneous, icon: ShieldCheck }
                          ].map((item, idx) => (
                            item.value && (
                              <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                                <div className="flex items-center gap-2">
                                  {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
                                  <span className="font-bold text-sm text-gray-700">{item.label}</span>
                                </div>
                                <span className="font-black text-[#0A0A0A] text-sm">{item.value}</span>
                              </div>
                            )
                          ))}
                        </div>
                        {plan.budgetBreakdown.totalEstimatedCost && (
                          <div className="mt-6 pt-4 border-t-4 border-[#0A0A0A] flex justify-between items-end">
                            <span className="font-black text-[#0A0A0A] uppercase tracking-wider text-sm">Est. Total (pp)</span>
                            <span className="font-black text-2xl text-[#0A0A0A]">{plan.budgetBreakdown.totalEstimatedCost}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
`;

code = code.replace(transportStr, transportAndBudgetStr);

// Now we need to make sure Home is imported since we used it in budgetBreakdown
const lucideRegex = /import \{ (.*?) \} from 'lucide-react';/;
code = code.replace(lucideRegex, "import { $1, Home } from 'lucide-react';");

fs.writeFileSync('src/pages/Home.tsx', code);
