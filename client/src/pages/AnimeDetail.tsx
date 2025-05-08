import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import GenreTag from "@/components/GenreTag";
import AnimeCard from "@/components/AnimeCard";
import { AnimeFull, AnimeBasic } from "@shared/types";
import { formatDateRange } from "@/lib/utils";

const AnimeDetail = () => {
  const [match, params] = useRoute("/anime/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: anime, isLoading, error } = useQuery<AnimeFull>({
    queryKey: [`/api/anime/${id}`],
    enabled: id > 0,
  });
  
  // Fetch recommended anime based on genres
  const { data: relatedAnime } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/search', null, anime?.genres?.[0]],
    enabled: !!anime?.genres && anime.genres.length > 0,
  });
  
  // Set page title when anime data is loaded
  useEffect(() => {
    if (anime) {
      document.title = `${anime.title} | Aniexo`;
    }
    
    return () => {
      document.title = "Aniexo";
    };
  }, [anime]);
  
  if (!match) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="py-12 bg-white dark:bg-neutral-dark">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-10"></div>
            
            <div className="bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/20 rounded-3xl overflow-hidden p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="rounded-xl overflow-hidden shadow-lg bg-gray-300 dark:bg-gray-700 h-96 w-full"></div>
                </div>
                <div className="lg:col-span-2">
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="flex space-x-2 mb-8">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
                  
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-3"></div>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-600 rounded-xl mb-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !anime) {
    return (
      <div className="py-12 bg-white dark:bg-neutral-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Anime</h2>
          <p className="mb-6">Sorry, we couldn't load the details for this anime. Please try again later.</p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 bg-white dark:bg-neutral-dark">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-2">Anime Details</h2>
          <p className="text-gray-600 dark:text-gray-300">Comprehensive information about this anime</p>
        </div>
        
        <div className="bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/20 rounded-3xl overflow-hidden p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              {/* Anime poster */}
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={anime.image} 
                  alt={anime.title} 
                  className="w-full"
                />
                {anime.score && (
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i> {anime.score.toFixed(1)}
                  </div>
                )}
              </div>
              
              {/* Quick info */}
              <div className="mt-6 bg-white dark:bg-neutral-medium rounded-xl p-5 shadow-md">
                <h4 className="font-semibold text-lg mb-4 font-poppins">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Format:</span>
                    <span className="font-medium">{anime.type || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Episodes:</span>
                    <span className="font-medium">{anime.episodes || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <span className="font-medium">{anime.status || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Aired:</span>
                    <span className="font-medium">
                      {anime.aired ? formatDateRange(anime.aired.from, anime.aired.to) : "Unknown"}
                    </span>
                  </div>
                  {anime.studios && anime.studios.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Studio:</span>
                      <span className="font-medium">{anime.studios.join(", ")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Source:</span>
                    <span className="font-medium">{anime.source || "Unknown"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {/* Anime details */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-2">{anime.title}</h1>
                {anime.title_japanese && (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{anime.title_japanese}</p>
                )}
                
                {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 mb-5">
                    {anime.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold font-poppins mb-3">Synopsis</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {anime.synopsis || "No synopsis available for this anime."}
                  </p>
                </div>
                
                {/* Trailer Section */}
                {anime.trailer?.youtube_id && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold font-poppins mb-3">Trailer</h3>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-neutral-medium rounded-xl overflow-hidden">
                      <iframe 
                        src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                        title={`${anime.title} trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                )}
                
                {/* Related/Similar Anime */}
                {relatedAnime && relatedAnime.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold font-poppins mb-4">You May Also Like</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {relatedAnime
                        .filter(related => related.id !== anime.id) // Filter out current anime
                        .slice(0, 4) // Show only 4 related anime
                        .map((related) => (
                          <Link key={related.id} href={`/anime/${related.id}`}>
                            <a className="anime-card rounded-lg overflow-hidden shadow-md">
                              <img 
                                src={related.image} 
                                alt={related.title} 
                                className="w-full aspect-[3/4] object-cover"
                                loading="lazy"
                              />
                              <div className="p-2">
                                <h4 className="font-medium text-sm line-clamp-1">{related.title}</h4>
                              </div>
                            </a>
                          </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
