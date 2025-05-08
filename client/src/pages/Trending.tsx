import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "@/components/AnimeCard";
import { AnimeBasic } from "@shared/types";

const Trending = () => {
  const { data: trendingAnime, isLoading } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/trending'],
  });
  
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
            {Array(20).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl overflow-hidden shadow-md">
                <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] w-full"></div>
                <div className="p-3 bg-white dark:bg-neutral-medium">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : trendingAnime && trendingAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
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
