import { Link } from "wouter";
import { AnimeBasic } from "@shared/types";
import { useEffect, useState } from "react";

interface AnimeCardProps {
  anime: AnimeBasic;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Placeholder image if the actual image fails to load
  const fallbackImageUrl = "https://via.placeholder.com/200x300?text=No+Image";
  
  return (
    <Link href={`/anime/${anime.id}`} className="anime-card rounded-xl overflow-hidden shadow-md dark:shadow-neutral-dark/50 bg-white dark:bg-neutral-medium hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={imageError ? fallbackImageUrl : anime.image} 
          alt={anime.title}
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {anime.score && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center">
            <i className="fas fa-star text-yellow-400 mr-1"></i> {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-montserrat font-semibold text-sm line-clamp-2">{anime.title}</h3>
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-gray-300">
            <span className="bg-gray-200 dark:bg-neutral-dark rounded-full px-2 py-0.5 truncate">
              {anime.genres[0]}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;
