import React from 'react';
import { cn } from '../../lib/utils';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { id: string; name: string; logo_url: string }[];
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({ items, pauseOnHover = true, className, ...props }: MarqueeProps) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden [--duration:40s] [--gap:1rem]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 justify-around gap-[var(--gap)] animate-marquee",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-sm whitespace-nowrap"
          >
            {item.logo_url && (
              <img src={item.logo_url} alt={item.name} className="h-6 w-6 object-contain rounded-full bg-white/80" />
            )}
            <span className="font-semibold tracking-wide">{item.name}</span>
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 justify-around gap-[var(--gap)] animate-marquee",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <div
            key={`${item.id}-dup`}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-sm whitespace-nowrap"
          >
            {item.logo_url && (
              <img src={item.logo_url} alt={item.name} className="h-6 w-6 object-contain rounded-full bg-white/80" />
            )}
            <span className="font-semibold tracking-wide">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
