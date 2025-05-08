import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import AnimeCardSmall from '@/components/AnimeCardSmall';
import { AnimeBasic, ApiResponse } from '@shared/types';
import { Favorite } from '@shared/schema';

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<(Favorite & { anime: AnimeBasic })[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to view your favorites',
        variant: 'destructive',
      });
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation, toast]);

  const { data, isLoading, error } = useQuery<ApiResponse<Favorite[]>>({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data?.success && data.data) {
      // The favorite list with anime details for display
      const favoritesWithDetails = data.data.map((fav: Favorite) => ({
        ...fav,
        anime: {
          id: fav.anime_id,
          title: fav.anime_title,
          image: fav.anime_image || '',
        },
      }));
      setFavorites(favoritesWithDetails);
    }
  }, [data]);

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      
      {isLoading ? (
        <div className="grid place-items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading your favorites...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Failed to load favorites</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-neutral-medium/20 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Browse anime and click the heart icon to add to your favorites!
          </p>
          <button
            onClick={() => setLocation('/')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Discover Anime
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.anime_id} className="relative">
              <AnimeCardSmall anime={favorite.anime} />
              <button
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors"
                onClick={() => {
                  // Handle remove from favorites
                  console.log('Remove from favorites:', favorite.anime_id);
                }}
              >
                <i className="fas fa-trash text-sm"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}