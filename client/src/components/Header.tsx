import { useState, useEffect } from "react";
import { Link, useLocation } from "@/lib/routing";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const [location] = useLocation();
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`w-full px-6 py-4 bg-white fixed top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'shadow-md py-3' 
          : 'shadow-sm py-5'
      }`}
    >
      <div className="container mx-auto flex items-center">
        {/* Logo and navigation grouped together */}
        <div className="flex items-center">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight mr-10">
            <Link href="/">
              <span className="cursor-pointer text-[#3a5a40] hover:text-[#588157] transition-colors">PURE BATANA</span>
            </Link>
          </div>

          {/* Navigation links next to logo */}
          <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <Link href="/benefits">
              <span className={`transition-colors cursor-pointer border-b-2 py-1 ${
                location === '/benefits' 
                  ? 'border-[#588157] text-[#3a5a40] font-semibold' 
                  : 'border-transparent hover:border-gray-300 hover:text-[#3a5a40]'
              }`}>
                Benefits
              </span>
            </Link>
            <Link href="/how-to-use">
              <span className={`transition-colors cursor-pointer border-b-2 py-1 ${
                location === '/how-to-use' 
                  ? 'border-[#588157] text-[#3a5a40] font-semibold' 
                  : 'border-transparent hover:border-gray-300 hover:text-[#3a5a40]'
              }`}>
                How to Use
              </span>
            </Link>
          </nav>
        </div>
        
        {/* Spacer to push cart button to the right */}
        <div className="flex-grow"></div>
        
        {/* Cart button on the right */}
        <div className="hidden md:block">
          <Link href="/cart">
            <button className="flex items-center bg-[#3a5a40] hover:bg-[#588157] text-white px-5 py-2 rounded-full transition-colors shadow-sm hover:shadow">
              <i className="fas fa-shopping-cart mr-2"></i>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="ml-2 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden ml-auto flex items-center">
          <Link href="/cart" className="mr-4">
            <button className="flex items-center bg-[#3a5a40] hover:bg-[#588157] text-white px-3 py-1 rounded-full transition-colors shadow-sm">
              <i className="fas fa-shopping-cart mr-1"></i>
              {cartCount > 0 && (
                <span className="ml-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full font-bold text-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
          <button 
            className="text-[#3a5a40] border border-[#3a5a40] rounded p-1" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-[calc(4rem+1px)] left-0 right-0 bg-white shadow-lg z-50 md:hidden border-t border-gray-100 animate-fadeDown">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link href="/benefits">
              <span className={`block py-2 px-3 rounded-md cursor-pointer ${
                location === '/benefits' 
                  ? 'bg-[#f1f8e9] text-[#3a5a40] font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                Benefits of Batana Oil
              </span>
            </Link>
            <Link href="/how-to-use">
              <span className={`block py-2 px-3 rounded-md cursor-pointer ${
                location === '/how-to-use' 
                  ? 'bg-[#f1f8e9] text-[#3a5a40] font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
                How to Use Batana Oil
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;