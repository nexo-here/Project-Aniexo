import axios from 'axios';
import { AnimeBasic, AnimeFull, NewsItem } from '@shared/types';

// Jikan API base URL
const API_BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting helper - Jikan has a rate limit of 3 requests per second
// This function adds a small delay between consecutive requests
const rateLimitedFetch = (() => {
  let lastFetchTime = 0;
  const RATE_LIMIT_INTERVAL = 350; // ms between requests

  return async (url: string) => {
    const now = Date.now();
    const timeElapsed = now - lastFetchTime;
    
    if (timeElapsed < RATE_LIMIT_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_INTERVAL - timeElapsed));
    }
    
    lastFetchTime = Date.now();
    return axios.get(url);
  };
})();

// Transform the Jikan API anime data to our format
function transformAnimeData(animeData: any): AnimeBasic {
  return {
    id: animeData.mal_id,
    title: animeData.title,
    image: animeData.images?.jpg?.image_url || '',
    score: animeData.score,
    genres: animeData.genres?.map((genre: any) => genre.name) || [],
    studios: animeData.studios?.map((studio: any) => studio.name) || [],
    type: animeData.type,
    season: animeData.season,
    year: animeData.year,
    episodes: animeData.episodes,
  };
}

// Transform the Jikan API full anime data to our format
function transformFullAnimeData(animeData: any): AnimeFull {
  return {
    id: animeData.mal_id,
    title: animeData.title,
    title_english: animeData.title_english,
    title_japanese: animeData.title_japanese,
    image: animeData.images?.jpg?.image_url || '',
    score: animeData.score,
    genres: animeData.genres?.map((genre: any) => genre.name) || [],
    season: animeData.season,
    year: animeData.year,
    type: animeData.type,
    studios: animeData.studios?.map((studio: any) => studio.name) || [],
    episodes: animeData.episodes,
    status: animeData.status,
    airing: animeData.airing,
    aired: animeData.aired,
    duration: animeData.duration,
    rating: animeData.rating,
    source: animeData.source,
    synopsis: animeData.synopsis,
    trailer: {
      youtube_id: animeData.trailer?.youtube_id,
      url: animeData.trailer?.url,
    },
    relations: animeData.relations?.map((relation: any) => ({
      relation: relation.relation,
      entry: relation.entry.map((entry: any) => ({
        id: entry.mal_id,
        name: entry.name,
        type: entry.type,
      })),
    })),
  };
}

// Transform the Jikan API news data to our format
function transformNewsData(newsData: any): NewsItem {
  return {
    id: newsData.mal_id,
    title: newsData.title,
    excerpt: newsData.excerpt,
    date: newsData.date,
    image: newsData.images?.jpg?.image_url || '',
    url: newsData.url,
  };
}

// Get trending anime - currently airing with high scores
export async function getTrendingAnime(): Promise<AnimeBasic[]> {
  try {
    const response = await rateLimitedFetch(`${API_BASE_URL}/anime?status=airing&order_by=popularity&sort=asc&limit=20`);
    return response.data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    throw error;
  }
}

// Get upcoming anime
export async function getUpcomingAnime(): Promise<AnimeBasic[]> {
  try {
    const response = await rateLimitedFetch(`${API_BASE_URL}/anime?status=upcoming&order_by=popularity&sort=asc&limit=10`);
    return response.data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching upcoming anime:', error);
    throw error;
  }
}

// Get underrated anime - complete anime with good scores but lower popularity
export async function getUnderratedAnime(): Promise<AnimeBasic[]> {
  try {
    // First fetch some anime with good scores
    const response = await rateLimitedFetch(
      `${API_BASE_URL}/anime?status=complete&min_score=7.5&order_by=score&sort=desc&limit=20`
    );
    
    // Then filter to get those with lower popularity
    const animes = response.data.data;
    const underratedAnimes = animes
      .sort((a: any, b: any) => b.score - a.score) // sort by score desc
      .slice(0, 10); // take top 10
    
    return underratedAnimes.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching underrated anime:', error);
    throw error;
  }
}

// Get featured anime - a random popular anime for the hero section
export async function getFeaturedAnime(): Promise<AnimeFull> {
  try {
    // Get one of the top popular animes
    const response = await rateLimitedFetch(`${API_BASE_URL}/anime?order_by=popularity&sort=asc&limit=5`);
    const animes = response.data.data;
    
    // Randomly select one of them
    const randomIndex = Math.floor(Math.random() * animes.length);
    const featuredAnimeId = animes[randomIndex].mal_id;
    
    // Get full details for the selected anime
    return await getAnimeById(featuredAnimeId);
  } catch (error) {
    console.error('Error fetching featured anime:', error);
    throw error;
  }
}

// Get anime by ID
export async function getAnimeById(id: number): Promise<AnimeFull> {
  try {
    const response = await rateLimitedFetch(`${API_BASE_URL}/anime/${id}/full`);
    return transformFullAnimeData(response.data.data);
  } catch (error) {
    console.error(`Error fetching anime with ID ${id}:`, error);
    throw error;
  }
}

// Search anime by query or genre
export async function searchAnime(query?: string, genre?: string): Promise<AnimeBasic[]> {
  try {
    let url = `${API_BASE_URL}/anime?order_by=popularity&sort=asc&limit=20`;
    
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
    
    if (genre) {
      url += `&genres=${encodeURIComponent(genre)}`;
    }
    
    const response = await rateLimitedFetch(url);
    return response.data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}

// Get anime news
export async function getAnimeNews(): Promise<NewsItem[]> {
  try {
    const response = await rateLimitedFetch(`${API_BASE_URL}/anime/1/news`);
    
    // Use any anime to get recent news (using ID 1, which is Cowboy Bebop)
    const newsItems = response.data.data.slice(0, 3); // Get only 3 news items
    return newsItems.map(transformNewsData);
  } catch (error) {
    console.error('Error fetching anime news:', error);
    throw error;
  }
}

// Get anime genres
export async function getGenres(): Promise<{ id: number, name: string }[]> {
  try {
    const response = await rateLimitedFetch(`${API_BASE_URL}/genres/anime`);
    return response.data.data.map((genre: any) => ({
      id: genre.mal_id,
      name: genre.name
    }));
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}
