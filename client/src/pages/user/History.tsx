import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ApiResponse } from '@shared/types';
import { History as WatchHistory } from '@shared/schema';

export default function History() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to view your watch history',
        variant: 'destructive',
      });
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation, toast]);

  const { data, isLoading, error } = useQuery<ApiResponse<WatchHistory[]>>({
    queryKey: ['/api/history'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data?.success && data.data) {
      setWatchHistory(data.data);
    }
  }, [data]);

  const clearHistory = async () => {
    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (data.success) {
        setWatchHistory([]);
        toast({
          title: 'History cleared',
          description: 'Your watch history has been cleared successfully',
        });
      } else {
        throw new Error(data.error || 'Failed to clear history');
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear watch history. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Watch History</h1>
        {watchHistory.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearHistory}
            className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
          >
            Clear History
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid place-items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading your watch history...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Failed to load watch history</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : watchHistory.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-neutral-medium/20 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No watch history yet</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            View anime details to add them to your watch history!
          </p>
          <button
            onClick={() => setLocation('/')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Discover Anime
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 font-medium">Anime</th>
                <th className="px-6 py-3 font-medium">Viewed On</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {watchHistory.map((item) => (
                <tr key={item.id} className="bg-white dark:bg-neutral-medium/10 hover:bg-gray-50 dark:hover:bg-neutral-medium/20">
                  <td className="px-6 py-4 font-medium">{item.anime_title}</td>
                  <td className="px-6 py-4">{item.viewed_at ? formatDate(item.viewed_at.toString()) : 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/anime/${item.anime_id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}