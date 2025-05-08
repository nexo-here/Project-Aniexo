import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { AnimeBasic } from "@shared/types";
import GenreTag from "@/components/GenreTag";
import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";

interface SearchProps {
  onClose: () => void;
}

const Search = ({ onClose }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  
  // Placeholder image if the actual image fails to load
  const fallbackImageUrl = "https://via.placeholder.com/180x250?text=No+Image";
  
  // Fetch genres for quick filtering
  const { data: genres } = useQuery<{id: number, name: string}[]>({
    queryKey: ['/api/genres'],
    enabled: true,
  });
  
  // Build query parameters for the search
  const searchParams = new URLSearchParams();
  if (searchTerm) searchParams.append('q', searchTerm);
  if (selectedGenre) searchParams.append('genre', selectedGenre);
  
  const searchUrl = `/api/anime/search?${searchParams.toString()}`;
  
  const { data: searchResults, isLoading, error } = useQuery<AnimeBasic[]>({
    queryKey: ['animeSearch', searchTerm, selectedGenre],
    queryFn: async () => {
      if (searchTerm.length < 3 && !selectedGenre) {
        return [];
      }
      
      try {
        const response = await fetch(searchUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        return data.success ? data.data : [];
      } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
      }
    },
    enabled: searchTerm.length > 2 || !!selectedGenre,
    retry: 1,
  });
  
  useEffect(() => {
    if (error) {
      console.error("Error fetching search results:", error);
    }
  }, [error]);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  const handleImageError = (animeId: number) => {
    setImageErrors(prev => ({...prev, [animeId]: true}));
  };
  
  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
      setSearchTerm("");
    }
  };
  
  return (
    <div className="bg-white dark:bg-neutral-dark border-t border-gray-200 dark:border-neutral-dark py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search anime by title, genre, studio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-dark text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setSearchTerm("")}
          >
            {searchTerm ? (
              <span>✕</span>
            ) : (
              <span>🔍</span>
            )}
          </button>
        </div>
        
        {/* Quick genre filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {genres?.slice(0, 8).map((genre) => (
            <GenreTag
              key={genre.id}
              name={genre.name}
              onClick={() => handleGenreClick(genre.name)}
              isActive={selectedGenre === genre.name}
            />
          ))}
        </div>
        
        {/* Search Results */}
        {(searchTerm.length > 2 || selectedGenre) && (
          <div className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 pt-2">
                {Array(6).fill(0).map((_, index) => (
                  <AnimeCardSkeleton key={index} size="small" />
                ))}
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto custom-scrollbar pt-2">
                {searchResults.map((anime) => (
                  <Link 
                    key={anime.id} 
                    href={`/anime/${anime.id}`}
                    onClick={onClose}
                    className="anime-card rounded-lg overflow-hidden shadow-md bg-white dark:bg-neutral-medium hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img 
                        src={imageErrors[anime.id] ? fallbackImageUrl : anime.image} 
                        alt={anime.title}
                        className="w-full aspect-[2/3] object-cover"
                        loading="lazy"
                        onError={() => handleImageError(anime.id)}
                      />
                      {anime.score && (
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <span className="text-yellow-400 mr-1">★</span> {anime.score.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{anime.title}</h3>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2 h-8">
                        {anime.type && <span className="mr-1">{anime.type}</span>}
                        {anime.episodes && <span className="mr-1">• {anime.episodes} eps</span>}
                        {anime.season && anime.year && <span>• {anime.season} {anime.year}</span>}
                      </p>
                      {anime.genres && anime.genres.length > 0 && (
                        <div className="mt-1 text-xs">
                          <span className="bg-gray-200 dark:bg-neutral-dark rounded-full px-2 py-0.5 text-gray-800 dark:text-gray-300 truncate">
                            {anime.genres[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error loading search results</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-700 dark:text-gray-300">
                <p className="text-lg mb-2">No results found</p>
                <p className="text-sm">Try a different search term or genre</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
