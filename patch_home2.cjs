const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldButton = `                  {loadingPlan ? (
                    <div className="w-5 h-5 border-4 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate AI Itinerary
                    </>
                  )}`;
                  
const newButton = `                  {loadingPlan ? (
                    <>
                      <div className="w-5 h-5 border-4 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                      {isLoadingLocation ? "Fetching location..." : "Generating..."}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate AI Itinerary
                    </>
                  )}`;
                  
code = code.replace(oldButton, newButton);
fs.writeFileSync('src/pages/Home.tsx', code);
