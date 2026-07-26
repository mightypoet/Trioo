import * as React from "react";
import { ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import WishlistButton from "./WishlistButton";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tripId: string;
  imageUrl: string;
  location: string;
  stats: string;
  href: string;
  themeColor: string; 
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, tripId, imageUrl, location, stats, href, themeColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ "--theme-color": themeColor } as React.CSSProperties}
        className={cn("group relative w-full h-full min-h-[400px]", className)}
        {...props}
      >
        <div className="absolute top-6 right-6 z-20 group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-200">
          <WishlistButton tripId={tripId} />
        </div>
        <a
          href={href}
          className="relative block w-full h-full rounded-[32px] overflow-hidden border-4 border-[#0A0A0A] bg-white transition-all duration-200 hover:-translate-y-2 hover:translate-x-2"
          style={{ boxShadow: '8px 8px 0px 0px rgba(10,10,10,1)' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          />
          <div className="relative flex flex-col justify-end h-full p-8 text-white">
            <h3 className="text-4xl font-black tracking-tighter mb-1" style={{ textShadow: '2px 2px 0px #0A0A0A' }}>
              {location}
            </h3>
            <p className="text-base font-bold mb-6" style={{ textShadow: '1px 1px 0px #0A0A0A' }}>{stats}</p>
            <div className="flex items-center justify-between bg-white text-[#0A0A0A] border-4 border-[#0A0A0A] rounded-xl px-5 py-4 transition-all duration-300" style={{ boxShadow: '4px 4px 0px 0px rgba(10,10,10,1)' }}>
              <span className="text-sm font-black tracking-wide uppercase">Explore Packages</span>
              <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" strokeWidth={3} />
            </div>
          </div>
        </a>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
