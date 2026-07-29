import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTripImageUrl(trip: any): string {
  let url = '';
  if (typeof trip === 'string') {
    url = trip;
  } else {
    url = trip?.cover_image;
    if (!url && Array.isArray(trip?.images) && trip.images.length > 0) {
      url = trip.images[0];
    }
  }
  if (!url) return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop';
  
  if (!url.startsWith('http')) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    return `${supabaseUrl}/storage/v1/object/public/trioo-images/${url}`;
  }
  return url;
}
