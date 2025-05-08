import { Link } from "wouter";
import { AnimeBasic } from "@shared/types";
import { useState } from "react";

interface AnimeCardLargeProps {
  anime: AnimeBasic;
}

const AnimeCardLarge = ({ anime }: AnimeCardLargeProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Placeholder image if the actual image fails to load
  const fallbackImageUrl = "https://via.placeholder.com/300x450?text=No+Image";
  
  return (
    <Link href={`/anime/${anime.id}`} className="anime-card flex bg-white dark:bg-neutral-medium rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="w-1/3 h-auto">
        <img 
          src={imageError ? fallbackImageUrl : anime.image} 
          alt={anime.title} 
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="w-2/3 p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-montserrat font-semibold text-lg">{anime.title}</h3>
          {anime.score && (
            <div className="bg-gray-100 dark:bg-neutral-dark text-primary px-2 py-1 rounded text-xs font-medium flex items-center">
              <i className="fas fa-star text-yellow-400 mr-1"></i> {anime.score.toFixed(1)}
            </div>
          )}
        </div>
        
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {anime.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-neutral-dark text-gray-700 dark:text-gray-300 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-3">
          {(anime as any).synopsis || `Explore more about ${anime.title} by clicking for full details.`}
        </p>
        
        <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
          {anime.episodes && (
            <span className="mr-3"><i className="fas fa-film mr-1"></i> {anime.episodes} Episodes</span>
          )}
          {anime.studios && anime.studios.length > 0 && (
            <span><i className="fas fa-building mr-1"></i> {anime.studios[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCardLarge;
