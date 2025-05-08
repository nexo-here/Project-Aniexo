import { Link } from "wouter";
import { AnimeBasic } from "@shared/types";

interface AnimeCardLargeProps {
  anime: AnimeBasic;
}

const AnimeCardLarge = ({ anime }: AnimeCardLargeProps) => {
  return (
    <Link href={`/anime/${anime.id}`}>
      <a className="anime-card flex bg-white dark:bg-neutral-medium rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="w-1/3 h-auto">
          <img 
            src={anime.image} 
            alt={anime.title} 
            className="w-full h-full object-cover"
            loading="lazy"
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
          
          {anime.synopsis && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-3">
              {anime.synopsis}
            </p>
          )}
          
          <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
            {anime.episodes && (
              <span className="mr-3"><i className="fas fa-film mr-1"></i> {anime.episodes} Episodes</span>
            )}
            {anime.studios && anime.studios.length > 0 && (
              <span><i className="fas fa-building mr-1"></i> {anime.studios[0]}</span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default AnimeCardLarge;
