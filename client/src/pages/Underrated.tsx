import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AnimeCardLarge from "@/components/AnimeCardLarge";
import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";
import { AnimeBasic } from "@shared/types";

const Underrated = () => {
  const { data: underratedAnime, isLoading } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/underrated'],
  });
  
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
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse flex bg-white dark:bg-neutral-medium rounded-xl overflow-hidden shadow-md">
                <div className="w-1/3 bg-gray-300 dark:bg-gray-700"></div>
                <div className="w-2/3 p-5">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                  <div className="flex space-x-2 mb-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-11/12 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-10/12 mb-3"></div>
                  <div className="flex">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 mr-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : underratedAnime && underratedAnime.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {underratedAnime.map((anime) => (
              <AnimeCardLarge key={anime.id} anime={anime} />
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
