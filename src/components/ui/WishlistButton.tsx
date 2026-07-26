import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface WishlistButtonProps {
  tripId: string;
  className?: string;
}

export default function WishlistButton({ tripId, className }: WishlistButtonProps) {
  const { user, requireAuth } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsSaved(false);
      return;
    }

    const checkSaved = async () => {
      try {
        const { data, error } = await supabase
          .from('user_wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('trip_id', tripId)
          .maybeSingle();

        if (data && !error) {
          setIsSaved(true);
        }
      } catch (err) {
        console.error('Error checking wishlist:', err);
      }
    };

    checkSaved();
  }, [user, tripId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(async () => {
      if (!user) return;
      if (isLoading) return;

      const previousState = isSaved;
      setIsSaved(!isSaved);
      setIsLoading(true);

      try {
        if (!previousState) {
          // Add to wishlist
          const { error } = await supabase
            .from('user_wishlist')
            .insert({ user_id: user.id, trip_id: tripId });

          if (error) throw error;
        } else {
          // Remove from wishlist
          const { error } = await supabase
            .from('user_wishlist')
            .delete()
            .eq('user_id', user.id)
            .eq('trip_id', tripId);

          if (error) throw error;
        }
      } catch (err) {
        console.error('Error updating wishlist:', err);
        // Revert on error
        setIsSaved(previousState);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <button
      onClick={toggleWishlist}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 border-2 border-[#0A0A0A]",
        isSaved ? "bg-white shadow-[2px_2px_0px_0px_rgba(10,10,10,1)] -translate-y-0.5 translate-x-0.5" : "bg-white/40 backdrop-blur-md hover:bg-white/90",
        className
      )}
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          isSaved ? "fill-[var(--color-pink)] text-[var(--color-pink)]" : "text-[#0A0A0A]"
        )}
      />
    </button>
  );
}
