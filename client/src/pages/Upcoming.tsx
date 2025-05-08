import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AnimeCardSmall from "@/components/AnimeCardSmall";
import { AnimeBasic } from "@shared/types";

const Upcoming = () => {
  const { data: upcomingAnime, isLoading } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/upcoming'],
  });
  
  // Set page title
  useEffect(() => {
    document.title = "Upcoming Anime | Aniexo";
    return () => {
      document.title = "Aniexo";
    };
  }, []);
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-neutral-dark/50">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-poppins mb-2">Upcoming Anime</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover the most anticipated anime releases coming soon</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl overflow-hidden shadow-md">
                <div className="bg-gray-300 dark:bg-gray-700 h-80 w-full"></div>
                <div className="p-4 bg-white dark:bg-neutral-medium">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="flex items-center">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 mr-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingAnime && upcomingAnime.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingAnime.map((anime) => (
              <AnimeCardSmall key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-4">No upcoming anime found.</p>
            <p>Check back later for updates on upcoming releases!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Upcoming;
