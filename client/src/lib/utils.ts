import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const getYearFromDateString = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch (e) {
    return 'Unknown';
  }
};

// Helper to get a display-friendly date range
export const formatDateRange = (from?: string, to?: string): string => {
  if (!from) return 'Unknown';
  
  const fromDate = new Date(from);
  const fromMonth = fromDate.toLocaleString('default', { month: 'short' });
  const fromYear = fromDate.getFullYear();
  
  if (!to || to.includes('null')) {
    return `${fromMonth} ${fromYear} - Present`;
  }
  
  const toDate = new Date(to);
  const toMonth = toDate.toLocaleString('default', { month: 'short' });
  const toYear = toDate.getFullYear();
  
  if (fromYear === toYear) {
    return `${fromMonth} - ${toMonth} ${toYear}`;
  }
  
  return `${fromMonth} ${fromYear} - ${toMonth} ${toYear}`;
};
