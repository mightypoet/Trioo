const fs = require('fs');

const current = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const importsToReplace = `import { Search, MapPin, Calendar, Users, ArrowRight, Star, Wallet, PlayCircle } from 'lucide-react';`;
const newImports = `import { Search, MapPin, Calendar, Users, ArrowRight, Star, Wallet, PlayCircle, Zap, Map, ShieldCheck, Quote } from 'lucide-react';`;

let newCode = current.replace(importsToReplace, newImports);

// We want to slice the code up to Featured Destinations section.
const parts = newCode.split("{/* Featured Destinations */}");
let topPart = parts[0];
let restPart = parts[1];

const featuresSection = `
      {/* What can you do with Travy AI? */}
      <section className="px-6 py-24 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px var(--color-primary)' }}>
              What can you do with Travy AI?
            </h2>
            <p className="text-xl font-bold text-[#0A0A0A]/80 max-w-2xl mx-auto">
              Everything you need to plan, budget, and book your dream trip—powered by our intelligent travel engine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FFE5E5] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">AI Itinerary Generation</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Generate detailed, day-by-day plans in seconds based on your unique travel style and preferences.</p>
            </div>
            
            <div className="bg-[#E5F4FF] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Wallet className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">Smart Budgeting</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Find packages and experiences that strictly fit your wallet. Say goodbye to hidden costs.</p>
            </div>

            <div className="bg-[#E5FFE9] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <ShieldCheck className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">Verified Agencies</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Book confidently with vetted local experts and travel operators who know the destination best.</p>
            </div>

            <div className="bg-[#FFF4E5] p-8 rounded-[2rem] border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-[#0A0A0A] flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Map className="w-7 h-7 text-[#0A0A0A]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">Live Journey Maps</h3>
              <p className="text-[#0A0A0A] font-bold text-lg">Interactive 3D treasure maps for your routes. Visualize your entire journey before you even pack.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
`;

let restParts = restPart.split("{/* TRAVY Wallet Promo */}");
let destinationsPart = restParts[0];

const bottomSections = `
      {/* Impact Metrics Bar */}
      <section className="py-12 bg-cyan-400 border-y-4 border-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 text-center">
            <div className="flex-1">
              <p className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-2" style={{ textShadow: '2px 2px 0px #fff' }}>2.5M+</p>
              <p className="text-xl font-bold text-[#0A0A0A]">Trips Planned</p>
            </div>
            <div className="hidden md:block w-1 h-16 bg-[#0A0A0A] rounded-full"></div>
            <div className="flex-1">
              <p className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-2" style={{ textShadow: '2px 2px 0px #fff' }}>10,000+</p>
              <p className="text-xl font-bold text-[#0A0A0A]">Verified Stays</p>
            </div>
            <div className="hidden md:block w-1 h-16 bg-[#0A0A0A] rounded-full"></div>
            <div className="flex-1">
              <p className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-2" style={{ textShadow: '2px 2px 0px #fff' }}>100k+</p>
              <p className="text-xl font-bold text-[#0A0A0A]">Planning Hours Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonial Wall */}
      <section className="px-6 py-24 relative bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px #FFD700' }}>
              Don't just take our word for it.
            </h2>
            <p className="text-xl font-bold text-[#0A0A0A]/80 max-w-2xl mx-auto">
              Real travelers saving real time and money with Travy AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFFACD] p-8 rounded-none border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#0A0A0A] fill-[#0A0A0A]" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#0A0A0A]/20 mb-4" />
              <p className="text-[#0A0A0A] font-bold text-lg mb-6 leading-relaxed">
                "It literally built a 7-day Thailand itinerary for me in 10 seconds. What usually takes me weeks of reading blogs was done instantly. Unbelievable!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-[#0A0A0A]">Sarah Jenkins</p>
                  <p className="font-bold text-[#0A0A0A]/70 text-sm">Saved 14 hours of planning</p>
                </div>
              </div>
            </div>

            <div className="bg-[#E0FFFF] p-8 rounded-none border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform mt-4 md:mt-8">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#0A0A0A] fill-[#0A0A0A]" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#0A0A0A]/20 mb-4" />
              <p className="text-[#0A0A0A] font-bold text-lg mb-6 leading-relaxed">
                "The smart budgeting feature is a lifesaver. We had a strict budget for our honeymoon, and Travy found us verified agencies that perfectly matched it."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-[#0A0A0A]">David & Emma</p>
                  <p className="font-bold text-[#0A0A0A]/70 text-sm">Saved ₹25,000 on bookings</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFC0CB] p-8 rounded-none border-4 border-[#0A0A0A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform mt-2 md:-mt-4">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#0A0A0A] fill-[#0A0A0A]" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-[#0A0A0A]/20 mb-4" />
              <p className="text-[#0A0A0A] font-bold text-lg mb-6 leading-relaxed">
                "As someone who hates planning but loves traveling, this app is exactly what I needed. The agencies are legit, and the itineraries are spot on."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#0A0A0A] bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-[#0A0A0A]">Marcus Lee</p>
                  <p className="font-bold text-[#0A0A0A]/70 text-sm">Booked 3 trips this year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Audience CTA */}
      <section className="px-6 py-24 relative bg-white border-t-4 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 text-[#0A0A0A]" style={{ textShadow: '2px 2px 0px var(--color-primary)' }}>
              One Platform.<br/>Boundless Adventures.
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left Card: Explorers */}
            <div className="flex-1 bg-[var(--color-primary)] p-10 md:p-14 rounded-[3rem] border-4 border-[#0A0A0A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between group">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#0A0A0A] mb-8" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>
                  <MapPin className="w-4 h-4 text-[#0A0A0A]" />
                  <span className="text-sm font-black text-[#0A0A0A]">For Explorers</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-6 leading-tight">Start your next adventure.<br/>AI plans, you pack.</h3>
                <p className="text-[#0A0A0A] font-bold text-xl mb-10 max-w-md">Stop wasting time juggling a dozen tabs. Let our AI build the perfect itinerary and find the best local operators for you.</p>
              </div>
              <Link to="/ai-planner" className="bg-white text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-full px-8 py-5 text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors w-fit flex items-center gap-3">
                Start Planning <ArrowRight className="w-6 h-6" />
              </Link>
            </div>

            {/* Right Card: Agencies */}
            <div className="flex-1 bg-[#D8B4E2] p-10 md:p-14 rounded-[3rem] border-4 border-[#0A0A0A] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between group">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#0A0A0A] mb-8" style={{ boxShadow: '2px 2px 0px 0px rgba(10,10,10,1)' }}>
                  <Users className="w-4 h-4 text-[#0A0A0A]" />
                  <span className="text-sm font-black text-[#0A0A0A]">For Agencies</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-6 leading-tight">Grow your travel business.<br/>Reach 2M+ travelers.</h3>
                <p className="text-[#0A0A0A] font-bold text-xl mb-10 max-w-md">Join our network of verified travel operators. Access high-intent travelers and manage bookings effortlessly through our portal.</p>
              </div>
              <Link to="/agency-portal" className="bg-white text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-full px-8 py-5 text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors w-fit flex items-center gap-3">
                Partner With Us <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

const finalCode = topPart + featuresSection + destinationsPart + bottomSections;

fs.writeFileSync('src/pages/Home.tsx', finalCode);

