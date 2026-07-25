import * as React from "react";
import { ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  stats: string;
  href: string;
  themeColor: string; 
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, imageUrl, location, stats, href, themeColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ "--theme-color": themeColor } as React.CSSProperties}
        className={cn("group w-full h-full min-h-[400px]", className)}
        {...props}
      >
        <a
          href={href}
          className="relative block w-full h-full rounded-[32px] overflow-hidden shadow-lg transition-all duration-500 ease-in-out group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
          style={{ boxShadow: `0 0 40px -15px hsl(var(--theme-color) / 0.5)` }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95), hsl(var(--theme-color) / 0.5) 40%, transparent 70%)` }}
          />
          <div className="relative flex flex-col justify-end h-full p-8 text-white">
            <h3 className="text-3xl font-bold tracking-tight mb-1">
              {location}
            </h3>
            <p className="text-base text-white/90 font-medium mb-6">{stats}</p>
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40">
              <span className="text-sm font-semibold tracking-wide uppercase">Explore Packages</span>
              <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"/>
            </div>
          </div>
        </a>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
