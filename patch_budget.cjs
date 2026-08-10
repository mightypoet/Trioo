const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldBudgetStr = `                    {/* Budget Breakdown */}
                    {plan?.budgetBreakdown && (
                      <div className="bg-yellow-300 border-4 border-[#0A0A0A] rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-[#0A0A0A]">
                          <IndianRupee className="w-6 h-6" strokeWidth={3} />
                          Budget Estimate
                        </h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Accommodation', value: plan.budgetBreakdown.accommodation, icon: HomeIcon },
                            { label: 'Local Transport', value: plan.budgetBreakdown.localTransport, icon: Navigation },
                            { label: 'Food & Dining', value: plan.budgetBreakdown.foodAndDining, icon: Flame },
                            { label: 'Activities', value: plan.budgetBreakdown.entryFeesAndActivities, icon: Star },
                            { label: 'Miscellaneous', value: plan.budgetBreakdown.miscellaneous, icon: ShieldCheck }
                          ].map((item, idx) => (
                            item.value && (
                              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-4 rounded-xl border-2 border-[#0A0A0A] shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]">
                                <div className="flex items-center gap-2 shrink-0">
                                  {item.icon && <item.icon className="w-5 h-5 text-gray-700" />}
                                  <span className="font-bold text-sm text-gray-800">{item.label}</span>
                                </div>
                                <span className="font-black text-[#0A0A0A] text-sm sm:text-right break-words">{item.value}</span>
                              </div>
                            )
                          ))}
                        </div>
                        {plan.budgetBreakdown.totalEstimatedCost && (
                          <div className="mt-6 pt-6 border-t-4 border-[#0A0A0A] flex flex-col sm:flex-row justify-between sm:items-end gap-2">
                            <span className="font-black text-[#0A0A0A] uppercase tracking-wider text-sm">Est. Total (pp)</span>
                            <span className="font-black text-3xl text-[#0A0A0A]">{plan.budgetBreakdown.totalEstimatedCost}</span>
                          </div>
                        )}
                      </div>
                    )}`;

const newBudgetStr = `                    {/* Budget Breakdown */}
                    {plan?.budgetBreakdown && (
                      <div className="bg-yellow-300 border-4 border-[#0A0A0A] rounded-[2rem] p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] h-fit">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-[#0A0A0A]">
                          <IndianRupee className="w-6 h-6" strokeWidth={3} />
                          Budget Estimate
                        </h3>
                        <div className="flex flex-col">
                          {[
                            { label: 'Accommodation', desc: 'Hotel or hostel stay', value: plan.budgetBreakdown.accommodation, icon: HomeIcon },
                            { label: 'Local Transport', desc: 'Cabs, metros, autos', value: plan.budgetBreakdown.localTransport, icon: Navigation },
                            { label: 'Food & Dining', desc: 'Meals and snacks', value: plan.budgetBreakdown.foodAndDining, icon: Flame },
                            { label: 'Activities', desc: 'Entry fees and tours', value: plan.budgetBreakdown.entryFeesAndActivities, icon: Star },
                            { label: 'Miscellaneous', desc: 'Shopping and tips', value: plan.budgetBreakdown.miscellaneous, icon: ShieldCheck }
                          ].map((item, idx) => (
                            item.value && (
                              <div key={idx} className="flex justify-between items-start py-3 border-b border-black/20 last:border-0">
                                <div className="flex flex-col">
                                  <div className="font-bold text-lg flex items-center gap-2 text-[#0A0A0A]">
                                    {item.icon && <item.icon className="w-5 h-5" strokeWidth={2.5} />}
                                    {item.label}
                                  </div>
                                  <span className="text-sm text-gray-800/80 mt-1 max-w-[70%]">{item.desc}</span>
                                </div>
                                <div className="font-extrabold text-lg text-right whitespace-nowrap text-[#0A0A0A] mt-0.5">
                                  {item.value}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                        {plan.budgetBreakdown.totalEstimatedCost && (
                          <div className="mt-4 pt-4 border-t-4 border-[#0A0A0A] flex justify-between items-center gap-2">
                            <span className="font-black text-[#0A0A0A] uppercase tracking-wider text-xl">Est. Total (PP)</span>
                            <span className="font-black text-3xl text-[#0A0A0A]">{plan.budgetBreakdown.totalEstimatedCost}</span>
                          </div>
                        )}
                      </div>
                    )}`;

code = code.replace(oldBudgetStr, newBudgetStr);

fs.writeFileSync('src/pages/Home.tsx', code);
