import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface AnimeCardSkeletonProps {
  size?: "small" | "medium" | "large";
}

const AnimeCardSkeleton = ({ size = "medium" }: AnimeCardSkeletonProps) => {
  if (size === "small") {
    return (
      <div className="flex-none w-48 rounded-xl overflow-hidden shadow-md bg-white dark:bg-neutral-medium animate-pulse">
        <div className="bg-gray-300 dark:bg-gray-700 h-60 w-full"></div>
        <div className="p-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  if (size === "large") {
    return (
      <div className="flex flex-col md:flex-row gap-6 animate-pulse">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-gray-300 dark:bg-gray-700 h-96 rounded-lg"></div>
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="anime-card rounded-xl overflow-hidden shadow-md bg-white dark:bg-neutral-medium animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] w-full"></div>
      <div className="p-3">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default AnimeCardSkeleton;