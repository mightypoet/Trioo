import { PlayCircle, Award, TrendingUp, CheckCircle, Upload } from 'lucide-react';

export default function CreatorRewards() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink/10 text-pink font-bold text-sm mb-6">
          <PlayCircle className="w-4 h-4 fill-pink" /> Trioo Creator Program
        </div>
        <h1 className="text-5xl font-bold mb-6">Share your journey.<br/>Earn free travel.</h1>
        <p className="text-xl text-gray-500">Upload your travel reels, get verified by our team, and earn Trioo Wallet credits, cashback, and exclusive perks.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Upload, title: '1. Upload Content', desc: 'Share your Instagram Reels, YouTube Shorts, or high-quality vlogs from your Trioo trips.' },
          { icon: CheckCircle, title: '2. Get Verified', desc: 'Our team reviews your content for quality and authenticity within 48 hours.' },
          { icon: Award, title: '3. Earn Rewards', desc: 'Receive up to ₹5,000 in your Trioo Wallet per approved video.' },
        ].map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="clay-card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="clay-card bg-gradient-to-br from-pink to-purple p-12 rounded-[3rem] text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to become a Creator?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who are funding their next adventure by sharing their experiences.
          </p>
          <button className="clay-btn-white px-8 py-4 text-lg inline-flex items-center gap-2">
            <Upload className="w-5 h-5" /> Submit a Reel
          </button>
        </div>
      </div>
    </div>
  );
}
