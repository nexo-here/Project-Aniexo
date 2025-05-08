import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "@/components/AnimeCard";
import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";
import { AnimeBasic } from "@shared/types";

const Trending = () => {
  const { data: trendingAnimeData, isLoading } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/trending'],
  });
  
  // Create a local array with unique identifiers to prevent React key conflicts
  const trendingAnime = trendingAnimeData?.map(anime => ({
    ...anime,
    uniqueKey: `trending-page-${anime.id}`
  }));
  
  // Set page title
  useEffect(() => {
    document.title = "Trending Anime | Aniexo";
    return () => {
      document.title = "Aniexo";
    };
  }, []);
  
  return (
    <section className="py-12 bg-white dark:bg-neutral-dark">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-poppins mb-2">Trending Anime</h1>
          <p className="text-gray-600 dark:text-gray-300">The most popular anime titles currently taking the community by storm</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[...Array(20)].map((_, index) => (
              <AnimeCardSkeleton key={`trending-page-skeleton-${index}`} />
            ))}
          </div>
        ) : trendingAnime && trendingAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.uniqueKey || `trending-page-${anime.id}`} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-4">No trending anime found.</p>
            <p>Check back later for the latest trending titles!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Trending;
