import axios from 'axios';
import { AnimeBasic, AnimeFull, NewsItem } from '@shared/types';

// Jikan API base URL
const API_BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting helper - Jikan has a rate limit of 3 requests per second (60/min)
// This function adds a delay between consecutive requests and handles retries
const rateLimitedFetch = (() => {
  let lastFetchTime = 0;
  const RATE_LIMIT_INTERVAL = 1500; // 1.5 seconds between requests to be safer
  const MAX_RETRIES = 3;

  return async (url: string, retryCount = 0): Promise<any> => {
    const now = Date.now();
    const timeElapsed = now - lastFetchTime;
    
    if (timeElapsed < RATE_LIMIT_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_INTERVAL - timeElapsed));
    }
    
    try {
      lastFetchTime = Date.now();
      return await axios.get(url);
    } catch (error: any) {
      // If we hit a rate limit and have retries left, wait longer and try again
      if (error.response && error.response.status === 429 && retryCount < MAX_RETRIES) {
        console.warn(`Rate limit hit for ${url}, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        // Wait progressively longer for each retry
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_INTERVAL * 2 * (retryCount + 1)));
        return rateLimitedFetch(url, retryCount + 1);
      }
      
      // For other errors or if we're out of retries, rethrow
      throw error;
    }
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
    let url = `${API_BASE_URL}/anime?limit=24`;
    
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
    
    if (genre) {
      // For exact genre search, use a separate call to get genre ID
      try {
        const genresResponse = await rateLimitedFetch(`${API_BASE_URL}/genres/anime`);
        const genres = genresResponse.data.data;
        const genreObj = genres.find((g: any) => 
          g.name.toLowerCase() === genre.toLowerCase()
        );
        
        if (genreObj) {
          url += `&genres=${genreObj.mal_id}`;
        } else {
          console.log(`Genre "${genre}" not found in Jikan API, using as search query`);
          // If genre not found, use it as part of the search query
          url += query ? `&genres_exclude=0` : `&q=${encodeURIComponent(genre)}`;
        }
      } catch (genreError) {
        console.error('Error fetching genres, using genre as query:', genreError);
        url += query ? `` : `&q=${encodeURIComponent(genre)}`;
      }
    }
    
    // Add ordering by popularity for better results
    url += `&order_by=popularity&sort=asc`;
    
    console.log(`Searching anime with URL: ${url}`);
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

// Mood-based anime recommendation
export async function getAnimeRecommendationsByMood(
  mood: string, 
  genres?: string[], 
  watchHistory?: number[]
): Promise<AnimeBasic[]> {
  try {
    // Map moods to appropriate search parameters
    const moodMappings: Record<string, {
      minScore?: number;
      genres?: string[];
      status?: string;
      orderBy?: string;
      sort?: string;
      limit?: number;
    }> = {
      "happy": { 
        minScore: 7.5, 
        genres: ["Comedy", "Slice of Life"],
        status: "complete",
        orderBy: "popularity" 
      },
      "sad": { 
        minScore: 7.8, 
        genres: ["Drama", "Tragedy"],
        orderBy: "score",
        sort: "desc" 
      },
      "excited": { 
        minScore: 8.0, 
        genres: ["Action", "Adventure", "Fantasy"],
        orderBy: "popularity" 
      },
      "relaxed": { 
        minScore: 7.0, 
        genres: ["Slice of Life", "Iyashikei", "Comedy"],
        orderBy: "score" 
      },
      "curious": { 
        minScore: 7.5, 
        genres: ["Mystery", "Psychological", "Sci-Fi"],
        orderBy: "score",
        sort: "desc" 
      },
      "romantic": { 
        minScore: 7.0, 
        genres: ["Romance", "Shoujo"],
        orderBy: "popularity" 
      },
      "adventurous": { 
        minScore: 7.5, 
        genres: ["Adventure", "Fantasy", "Action"],
        orderBy: "popularity" 
      }
    };

    // Default to "happy" if mood is not in our mappings
    const moodParams = moodMappings[mood.toLowerCase()] || moodMappings["happy"];
    
    // Incorporate user's genre preferences if provided
    let targetGenres = moodParams.genres || [];
    if (genres && genres.length > 0) {
      // Combine and deduplicate without using Set (for compatibility)
      const combinedGenres = [...targetGenres];
      genres.forEach(genre => {
        if (!combinedGenres.includes(genre)) {
          combinedGenres.push(genre);
        }
      });
      targetGenres = combinedGenres;
    }
    
    // Build URL with parameters
    let url = `${API_BASE_URL}/anime?limit=${moodParams.limit || 12}`;
    
    if (moodParams.minScore) {
      url += `&min_score=${moodParams.minScore}`;
    }
    
    if (moodParams.status) {
      url += `&status=${moodParams.status}`;
    }
    
    url += `&order_by=${moodParams.orderBy || "score"}`;
    url += `&sort=${moodParams.sort || "desc"}`;
    
    // We'll use the first genre for the request to get a good starting set
    if (targetGenres.length > 0) {
      try {
        const genresResponse = await rateLimitedFetch(`${API_BASE_URL}/genres/anime`);
        const genresData = genresResponse.data.data;
        
        // Find genre ID for the first preferred genre
        const genreObj = genresData.find((g: any) => 
          targetGenres.some(tg => g.name.toLowerCase() === tg.toLowerCase())
        );
        
        if (genreObj) {
          url += `&genres=${genreObj.mal_id}`;
        }
      } catch (error) {
        console.error('Error fetching genres for recommendations:', error);
      }
    }

    console.log(`Fetching mood-based recommendations with URL: ${url}`);
    const response = await rateLimitedFetch(url);
    let recommendations = response.data.data.map(transformAnimeData);
    
    // Filter out titles if they're in the watch history
    if (watchHistory && watchHistory.length > 0) {
      recommendations = recommendations.filter((anime: AnimeBasic) => !watchHistory.includes(anime.id));
    }
    
    // If we have too few recommendations, supplement with trending anime
    if (recommendations.length < 6) {
      const trending = await getTrendingAnime();
      
      const uniqueRecs = [...recommendations];
      const existingIds = new Set(uniqueRecs.map(a => a.id));
      
      // Add trending anime that isn't already in recommendations and isn't in watch history
      for (const anime of trending) {
        if (!existingIds.has(anime.id) && 
            (!watchHistory || !watchHistory.includes(anime.id))) {
          uniqueRecs.push(anime);
          existingIds.add(anime.id);
          if (uniqueRecs.length >= 10) break;
        }
      }
      
      recommendations = uniqueRecs;
    }
    
    return recommendations.slice(0, 12); // Return max 12 recommendations
  } catch (error) {
    console.error('Error getting anime recommendations by mood:', error);
    throw error;
  }
}
