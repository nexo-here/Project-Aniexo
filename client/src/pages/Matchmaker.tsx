import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimeBasic } from "@shared/types";
import AnimeCard from "@/components/AnimeCard";
import AnimeCardSkeleton from "@/components/AnimeCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

// Mood options for the matchmaker
const MOOD_OPTIONS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "excited", label: "Excited", emoji: "🤩" },
  { id: "relaxed", label: "Relaxed", emoji: "😌" },
  { id: "curious", label: "Curious", emoji: "🧐" },
  { id: "romantic", label: "Romantic", emoji: "❤️" },
  { id: "adventurous", label: "Adventurous", emoji: "🌍" },
];

const Matchmaker = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  const { data: genres } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["/api/genres"],
  });

  // Set page title
  useEffect(() => {
    document.title = "Anime Matchmaker | Aniexo";
    return () => {
      document.title = "Aniexo";
    };
  }, []);

  // Fetch recommendations based on mood and genre
  const {
    data: recommendations,
    isLoading: loadingRecommendations,
    refetch,
    isError,
  } = useQuery<AnimeBasic[]>({
    queryKey: [
      "/api/recommendations",
      {
        mood: selectedMood,
        genres: selectedGenre && selectedGenre !== "any" ? [selectedGenre] : undefined,
        user_id: isAuthenticated ? user?.id : undefined,
      },
    ],
    enabled: isSearching,
  });

  // Handle form submission
  const handleFindMatches = () => {
    if (selectedMood) {
      setIsSearching(true);
      refetch();
    }
  };

  // Reset the form
  const handleReset = () => {
    setSelectedMood("");
    setSelectedGenre("");
    setIsSearching(false);
  };

  return (
    <section className="py-12 bg-white dark:bg-neutral-dark min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-poppins mb-4">Anime Matchmaker</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Tell us how you're feeling today, and we'll match you with anime that fits your mood!
            {isAuthenticated && " We'll also consider your watch history for better recommendations."}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-dark/50 rounded-xl p-6 max-w-3xl mx-auto mb-12 shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">How are you feeling today?</h2>

          <div className="grid gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select your mood</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MOOD_OPTIONS.map((mood) => (
                  <Button
                    key={mood.id}
                    type="button"
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    onClick={() => setSelectedMood(mood.id)}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Genre preference (optional)
              </label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a genre (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any genre</SelectItem>
                  {genres?.map((genre) => (
                    <SelectItem key={genre.id} value={genre.name}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleFindMatches}
              disabled={!selectedMood || loadingRecommendations}
              className="flex-1"
              size="lg"
            >
              {loadingRecommendations ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Matching...
                </>
              ) : (
                "Find My Matches"
              )}
            </Button>
            {isSearching && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>

        {isSearching && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              {loadingRecommendations
                ? "Finding anime for you..."
                : recommendations && recommendations.length > 0
                ? `Here's what we found for your ${
                    MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label.toLowerCase() || ""
                  } mood`
                : "No matches found"}
            </h2>

            {loadingRecommendations ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {[...Array(12)].map((_, index) => (
                  <AnimeCardSkeleton key={`recommendation-skeleton-${index}`} />
                ))}
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {recommendations.map((anime, index) => (
                  <AnimeCard
                    key={`match-${anime.id}-${index}`}
                    anime={anime}
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-lg mb-4">
                  Something went wrong while fetching recommendations.
                </p>
                <p>Please try again with a different mood or genre.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg mb-4">
                  No anime found that matches your mood and preferences.
                </p>
                <p>Try a different mood or genre combination!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Matchmaker;