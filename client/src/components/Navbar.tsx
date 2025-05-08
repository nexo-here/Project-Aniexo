import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useTheme } from "@/components/ui/theme-provider";
import Search from "@/components/Search";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // Track scroll position to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-neutral-dark/90 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary font-poppins">Aniexo</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium ${location === '/' ? 'text-primary' : 'text-neutral-dark/70 dark:text-white/70'} hover:text-primary dark:hover:text-primary transition-colors`}>
              Home
            </Link>
            <Link href="/upcoming" className={`font-medium ${location === '/upcoming' ? 'text-primary' : 'text-neutral-dark/70 dark:text-white/70'} hover:text-primary dark:hover:text-primary transition-colors`}>
              Upcoming
            </Link>
            <Link href="/trending" className={`font-medium ${location === '/trending' ? 'text-primary' : 'text-neutral-dark/70 dark:text-white/70'} hover:text-primary dark:hover:text-primary transition-colors`}>
              Trending
            </Link>
            <Link href="/underrated" className={`font-medium ${location === '/underrated' ? 'text-primary' : 'text-neutral-dark/70 dark:text-white/70'} hover:text-primary dark:hover:text-primary transition-colors`}>
              Underrated
            </Link>
          </div>
          
          {/* Search & User Controls */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-medium transition-colors" 
              onClick={toggleSearch}
              aria-label="Search"
            >
              <i className="fas fa-search text-lg"></i>
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-medium transition-colors" 
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
            >
              <i className="fas fa-moon text-lg dark:hidden"></i>
              <i className="fas fa-sun text-lg hidden dark:block"></i>
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-medium transition-colors md:hidden" 
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Search Bar */}
      {searchOpen && <Search onClose={() => setSearchOpen(false)} />}
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-medium border-t border-gray-200 dark:border-neutral-medium py-4 shadow-md">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`font-medium py-2 border-b border-gray-100 dark:border-neutral-dark ${location === '/' ? 'text-primary' : 'text-neutral-dark dark:text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/upcoming" 
              className={`font-medium py-2 border-b border-gray-100 dark:border-neutral-dark ${location === '/upcoming' ? 'text-primary' : 'text-neutral-dark dark:text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Upcoming
            </Link>
            <Link 
              href="/trending" 
              className={`font-medium py-2 border-b border-gray-100 dark:border-neutral-dark ${location === '/trending' ? 'text-primary' : 'text-neutral-dark dark:text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </Link>
            <Link 
              href="/underrated" 
              className={`font-medium py-2 ${location === '/underrated' ? 'text-primary' : 'text-neutral-dark dark:text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Underrated
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
