import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-dark border-t border-gray-200 dark:border-neutral-medium py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-primary font-poppins">Aniexo</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Your ultimate anime information hub with the latest updates, reviews, and comprehensive details on all your favorite series.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                <i className="fab fa-reddit"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 font-poppins">Navigate</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/upcoming" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Upcoming Anime
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/underrated" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Underrated Gems
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">News & Articles</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 font-poppins">Genres</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Action</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Romance</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Comedy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Fantasy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Slice of Life</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 font-poppins">Contact Me</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://facebook.com/nexxo.0" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center">
                  <i className="fab fa-facebook text-lg w-6"></i>
                  <span>facebook.com/nexxo.0</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/+8801609189135" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center">
                  <i className="fab fa-whatsapp text-lg w-6"></i>
                  <span>+8801609189135</span>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/nexo.o.o" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center">
                  <i className="fab fa-instagram text-lg w-6"></i>
                  <span>instagram.com/nexo.o.o</span>
                </a>
              </li>
              <li>
                <a href="mailto:salneowaz@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center">
                  <i className="fas fa-envelope text-lg w-6"></i>
                  <span>salneowaz@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="https://x.com/nexo_here_00" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center">
                  <i className="fab fa-twitter text-lg w-6"></i>
                  <span>x.com/nexo_here_00</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-neutral-medium flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">&copy; {new Date().getFullYear()} Aniexo. All rights reserved.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
            Powered by <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">Jikan API</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
