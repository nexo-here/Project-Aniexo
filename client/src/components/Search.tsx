import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { AnimeBasic } from "@shared/types";
import GenreTag from "@/components/GenreTag";

interface SearchProps {
  onClose: () => void;
}

const Search = ({ onClose }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch genres for quick filtering
  const { data: genres } = useQuery<{id: number, name: string}[]>({
    queryKey: ['/api/genres'],
    enabled: true,
  });
  
  // Search query
  const { data: searchResults, isLoading } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/search', searchTerm, selectedGenre],
    enabled: searchTerm.length > 2 || !!selectedGenre,
  });
  
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
  
  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
      setSearchTerm("");
    }
  };
  
  return (
    <div className="bg-white dark:bg-neutral-medium border-t border-gray-200 dark:border-neutral-medium py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search anime by title, genre, studio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setSearchTerm("")}
          >
            {searchTerm ? (
              <i className="fas fa-times"></i>
            ) : (
              <i className="fas fa-search"></i>
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
              <p className="text-center py-4">Searching...</p>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto custom-scrollbar pt-2">
                {searchResults.map((anime) => (
                  <Link 
                    key={anime.id} 
                    href={`/anime/${anime.id}`}
                    onClick={onClose}
                  >
                    <a className="anime-card rounded-lg overflow-hidden shadow-md bg-white dark:bg-neutral-medium">
                      <div className="relative">
                        <img 
                          src={anime.image} 
                          alt={anime.title}
                          className="w-full aspect-[2/3] object-cover"
                          loading="lazy"
                        />
                        {anime.score && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                            <i className="fas fa-star text-yellow-400 mr-1"></i> {anime.score.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-montserrat font-semibold text-sm truncate">{anime.title}</h3>
                        {anime.genres && anime.genres.length > 0 && (
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                            <span className="bg-gray-200 dark:bg-neutral-dark rounded-full px-2 py-0.5 truncate">
                              {anime.genres[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">No results found. Try a different search term or genre.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
