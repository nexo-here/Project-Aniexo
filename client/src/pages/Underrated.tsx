import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AnimeCardLarge from "@/components/AnimeCardLarge";
import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";
import { AnimeBasic } from "@shared/types";

const Underrated = () => {
  const { data: underratedAnimeData, isLoading } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/underrated'],
  });
  
  // Create a local array with unique identifiers to prevent React key conflicts
  const underratedAnime = underratedAnimeData?.map((anime, index) => ({
    ...anime,
    uniqueKey: `underrated-page-${anime.id}-${index}`
  }));
  
  // Set page title
  useEffect(() => {
    document.title = "Underrated Anime Gems | Aniexo";
    return () => {
      document.title = "Aniexo";
    };
  }, []);
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-neutral-dark/50">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-poppins mb-2">Underrated Gems</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover excellent anime series that deserve more recognition</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(8)].map((_, index) => (
              <AnimeCardSkeleton key={`underrated-page-skeleton-${index}`} size="large" />
            ))}
          </div>
        ) : underratedAnime && underratedAnime.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {underratedAnime.map((anime) => (
              <AnimeCardLarge key={anime.uniqueKey} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-4">No underrated anime found.</p>
            <p>Check back later for hidden gems waiting to be discovered!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Underrated;
