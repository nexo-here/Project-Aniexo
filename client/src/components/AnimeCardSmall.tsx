import { Link } from "wouter";
import { AnimeBasic } from "@shared/types";
import { useState } from "react";

interface AnimeCardSmallProps {
  anime: AnimeBasic;
  size?: "medium" | "small";
}

const AnimeCardSmall = ({ anime, size = "medium" }: AnimeCardSmallProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Placeholder image if the actual image fails to load
  const fallbackImageUrl = "https://via.placeholder.com/250x350?text=No+Image";
  
  return (
    <Link 
      href={`/anime/${anime.id}`} 
      className={`anime-card rounded-lg overflow-hidden shadow-md flex-none ${size === "medium" ? "w-64" : "w-48"} hover:shadow-lg transition-shadow`}
    >
      <div className="relative h-auto overflow-hidden">
        <img 
          src={imageError ? fallbackImageUrl : anime.image} 
          alt={anime.title} 
          className={`w-full ${size === "medium" ? "h-80" : "h-64"} object-cover`}
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {anime.year && (
          <div className={`absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium ${anime.season ? "" : "capitalize"}`}>
            {anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : anime.year}
          </div>
        )}
      </div>
      <div className="p-4 bg-white dark:bg-neutral-medium">
        <h3 className="font-montserrat font-semibold text-base line-clamp-2">{anime.title}</h3>
        <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
          {anime.type && <span className="flex items-center mr-3"><i className="fas fa-tv mr-1 text-xs"></i> {anime.type}</span>}
          {anime.studios && anime.studios.length > 0 && (
            <span className="flex items-center"><i className="fas fa-building mr-1 text-xs"></i> {anime.studios[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCardSmall;
