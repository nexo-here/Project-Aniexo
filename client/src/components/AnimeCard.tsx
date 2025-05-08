import { Link } from "wouter";
import { AnimeBasic } from "@shared/types";

interface AnimeCardProps {
  anime: AnimeBasic;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <Link href={`/anime/${anime.id}`}>
      <a className="anime-card rounded-xl overflow-hidden shadow-md dark:shadow-neutral-dark/50 bg-white dark:bg-neutral-medium">
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
      </a>
    </Link>
  );
};

export default AnimeCard;
