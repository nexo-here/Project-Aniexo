import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AnimeCard from "@/components/AnimeCard";
import AnimeCardSmall from "@/components/AnimeCardSmall";
import AnimeCardLarge from "@/components/AnimeCardLarge";
import { AnimeFull, AnimeBasic, NewsItem } from "@shared/types";
import { formatDate, truncateText } from "@/lib/utils";

const Home = () => {
  // Fetch data for different sections
  const { data: featuredAnime, isLoading: loadingFeatured } = useQuery<AnimeFull>({
    queryKey: ['/api/anime/featured'],
  });
  
  const { data: trendingAnime, isLoading: loadingTrending } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/trending'],
  });
  
  const { data: upcomingAnime, isLoading: loadingUpcoming } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/upcoming'],
  });
  
  const { data: underratedAnime, isLoading: loadingUnderrated } = useQuery<AnimeBasic[]>({
    queryKey: ['/api/anime/underrated'],
  });
  
  const { data: newsItems, isLoading: loadingNews } = useQuery<NewsItem[]>({
    queryKey: ['/api/anime/news'],
  });
  
  // Carousel scroll functionality
  useEffect(() => {
    const carousels = document.querySelectorAll('.carousel');
    const prevButtons = document.querySelectorAll('.carousel-prev');
    const nextButtons = document.querySelectorAll('.carousel-next');
    
    const cleanupFunctions: (() => void)[] = [];
    
    carousels.forEach((carousel, index) => {
      const prevButton = prevButtons[index];
      const nextButton = nextButtons[index];
      
      if (prevButton && nextButton && carousel instanceof HTMLElement) {
        const handleNextClick = () => {
          carousel.scrollBy({ left: carousel.offsetWidth * 0.75, behavior: 'smooth' });
        };
        
        const handlePrevClick = () => {
          carousel.scrollBy({ left: -carousel.offsetWidth * 0.75, behavior: 'smooth' });
        };
        
        nextButton.addEventListener('click', handleNextClick);
        prevButton.addEventListener('click', handlePrevClick);
        
        cleanupFunctions.push(() => {
          nextButton.removeEventListener('click', handleNextClick);
          prevButton.removeEventListener('click', handlePrevClick);
        });
      }
    });
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [upcomingAnime]);
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center" style={{ 
        backgroundImage: loadingFeatured || !featuredAnime 
          ? 'linear-gradient(to bottom, #1a1a2e, #16213e)'
          : `url(${featuredAnime.image})` 
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
          {loadingFeatured ? (
            <div className="animate-pulse max-w-3xl w-full">
              <div className="h-6 w-32 bg-gray-300/30 rounded mb-3"></div>
              <div className="h-12 w-3/4 bg-gray-300/30 rounded mb-3"></div>
              <div className="h-4 w-full bg-gray-300/30 rounded mb-5"></div>
              <div className="h-4 w-11/12 bg-gray-300/30 rounded mb-5"></div>
              <div className="flex">
                <div className="h-12 w-40 bg-primary/50 rounded-lg mr-4"></div>
                <div className="h-12 w-40 bg-white/20 rounded-lg"></div>
              </div>
            </div>
          ) : featuredAnime ? (
            <div className="max-w-3xl">
              <span className="inline-block bg-primary text-white px-3 py-1 text-sm font-medium rounded-md mb-3">FEATURED ANIME</span>
              <h1 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-3">{featuredAnime.title}</h1>
              <p className="text-white/90 text-lg mb-5 line-clamp-2 md:line-clamp-3">
                {truncateText(featuredAnime.synopsis, 180)}
              </p>
              <div className="flex items-center space-x-4">
                {featuredAnime.trailer?.youtube_id ? (
                  <a 
                    href={`https://www.youtube.com/watch?v=${featuredAnime.trailer.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium flex items-center transition-colors"
                  >
                    <i className="fas fa-play mr-2"></i> 
                    Watch Trailer
                  </a>
                ) : (
                  <Button className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium flex items-center transition-colors">
                    <i className="fas fa-play mr-2"></i> 
                    Watch Trailer
                  </Button>
                )}
                
                <Link href={`/anime/${featuredAnime.id}`} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-6 rounded-lg font-medium flex items-center transition-colors">
                  <i className="fas fa-info-circle mr-2"></i>
                  More Info
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl">
              <span className="inline-block bg-primary text-white px-3 py-1 text-sm font-medium rounded-md mb-3">WELCOME TO ANIEXO</span>
              <h1 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-3">Discover Amazing Anime</h1>
              <p className="text-white/90 text-lg mb-5">
                Explore the world of anime with detailed information, reviews, and recommendations all in one place.
              </p>
              <Link href="/trending" className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium flex items-center transition-colors">
                <i className="fas fa-fire mr-2"></i>
                Explore Trending Now
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Latest News Section */}
      <section className="py-12 bg-white dark:bg-neutral-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-poppins">Latest News</h2>
            <a href="#" className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors flex items-center">
              View All <i className="fas fa-chevron-right text-xs ml-1"></i>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingNews ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse bg-neutral-light dark:bg-neutral-medium rounded-xl overflow-hidden shadow-md">
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : newsItems && newsItems.length > 0 ? (
              newsItems.map((news) => (
                <div key={news.id} className="bg-neutral-light dark:bg-neutral-medium rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={news.image || "https://via.placeholder.com/800x450?text=Anime+News"} 
                    alt={news.title} 
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formatDate(news.date)}</span>
                    <h3 className="font-montserrat font-semibold text-lg mt-2 mb-3">{news.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{news.excerpt}</p>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-4 text-primary font-medium hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-8">
                <p>No news available at the moment. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Upcoming Anime Section */}
      <section id="upcoming" className="py-12 bg-gray-50 dark:bg-neutral-dark/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-poppins">Upcoming Anime</h2>
            <Link href="/upcoming" className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors flex items-center">
              View All <i className="fas fa-chevron-right text-xs ml-1"></i>
            </Link>
          </div>
          
          <div className="relative">
            {loadingUpcoming ? (
              <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 custom-scrollbar">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse flex-none w-64 rounded-xl overflow-hidden shadow-md">
                    <div className="bg-gray-300 dark:bg-gray-700 h-80 w-full"></div>
                    <div className="p-4 bg-white dark:bg-neutral-medium">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                      <div className="flex items-center">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 mr-3"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="carousel flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 custom-scrollbar">
                {upcomingAnime && upcomingAnime.length > 0 ? (
                  upcomingAnime.map((anime) => (
                    <AnimeCardSmall key={anime.id} anime={anime} />
                  ))
                ) : (
                  <div className="w-full text-center py-8">
                    <p>No upcoming anime available at the moment. Check back later!</p>
                  </div>
                )}
              </div>
            )}
            
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-dark/80 backdrop-blur-sm rounded-full p-2 shadow-md z-10 hidden md:block carousel-prev">
              <i className="fas fa-chevron-left text-neutral-dark dark:text-white"></i>
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-dark/80 backdrop-blur-sm rounded-full p-2 shadow-md z-10 hidden md:block carousel-next">
              <i className="fas fa-chevron-right text-neutral-dark dark:text-white"></i>
            </button>
          </div>
        </div>
      </section>
      
      {/* Trending Anime Section */}
      <section id="trending" className="py-12 bg-white dark:bg-neutral-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-poppins">Trending Now</h2>
            <Link href="/trending" className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors flex items-center">
              View All <i className="fas fa-chevron-right text-xs ml-1"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {loadingTrending ? (
              Array(10).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse rounded-xl overflow-hidden shadow-md">
                  <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] w-full"></div>
                  <div className="p-3 bg-white dark:bg-neutral-medium">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              ))
            ) : trendingAnime && trendingAnime.length > 0 ? (
              trendingAnime.slice(0, 10).map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))
            ) : (
              <div className="col-span-2 md:col-span-3 lg:col-span-5 text-center py-8">
                <p>No trending anime available at the moment. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Underrated Gems Section */}
      <section id="underrated" className="py-12 bg-gray-50 dark:bg-neutral-dark/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-poppins">Underrated Gems</h2>
            <Link href="/underrated" className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors flex items-center">
              View All <i className="fas fa-chevron-right text-xs ml-1"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loadingUnderrated ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse flex bg-white dark:bg-neutral-medium rounded-xl overflow-hidden shadow-md">
                  <div className="w-1/3 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-2/3 p-5">
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="flex space-x-2 mb-3">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-11/12 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-10/12 mb-3"></div>
                    <div className="flex">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 mr-3"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : underratedAnime && underratedAnime.length > 0 ? (
              underratedAnime.slice(0, 4).map((anime) => (
                <AnimeCardLarge key={anime.id} anime={anime} />
              ))
            ) : (
              <div className="col-span-1 lg:col-span-2 text-center py-8">
                <p>No underrated anime available at the moment. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
