// Shared types for frontend and backend

export interface AnimeBasic {
  id: number;
  title: string;
  image: string;
  score?: number;
  genres?: string[];
  season?: string;
  year?: number;
  type?: string;
  studios?: string[];
  episodes?: number;
}

export interface AnimeFull extends AnimeBasic {
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  status?: string;
  airing?: boolean;
  aired?: {
    from?: string;
    to?: string;
  };
  duration?: string;
  rating?: string;
  source?: string;
  studios?: string[];
  trailer?: {
    youtube_id?: string;
    url?: string;
  };
  relations?: AnimeRelation[];
}

export interface AnimeRelation {
  relation: string;
  entry: {
    id: number;
    name: string;
    type: string;
  }[];
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export type Season = 'winter' | 'spring' | 'summer' | 'fall';
export type AnimeType = 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
export type AnimeStatus = 'airing' | 'complete' | 'upcoming';
export type SortOption = 'popularity' | 'rank' | 'score';
