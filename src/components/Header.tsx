import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  userLoggedIn: boolean;
  userRole?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  userLoggedIn,
  userRole
}) => {
  const { pathname } = useLocation();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isAdmin = userRole === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-bg/90 backdrop-blur-md border-b-2 border-action-dark/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity */}
        <Link 
          to={isAdmin ? "/admin" : "/shop"} 
          className="group flex items-center select-none"
          id="nav-logo"
        >
          <span className="font-display text-2xl md:text-3xl italic font-extrabold tracking-tighter uppercase text-action-dark group-hover:text-accent-red transition-colors duration-300">
            SNEAK ON EARS
          </span>
          {isAdmin && (
            <span className="ml-2 font-display text-[10px] font-bold bg-accent-red text-white py-0.5 px-2 tracking-widest uppercase">
              ADMIN DECK
            </span>
          )}
        </Link>

        {/* Central Nav links */}
        <nav className="hidden md:flex items-center gap-8 font-display text-sm tracking-widest uppercase font-semibold">
          {!isAdmin ? (
            <>
              <Link 
                to="/shop"
                className={`transition-colors py-1 ${
                  pathname === '/shop' || pathname.startsWith('/shop/') 
                    ? 'text-accent-red border-b-2 border-accent-red font-bold' 
                    : 'text-action-dark hover:text-accent-red'
                }`}
              >
                SHOP
              </Link>
              <Link 
                to="/articles"
                className={`transition-colors py-1 ${
                  pathname === '/articles' || pathname.startsWith('/articles/') 
                    ? 'text-accent-red border-b-2 border-accent-red font-bold' 
                    : 'text-action-dark hover:text-accent-red'
                }`}
              >
                ARTICLES
              </Link>
              <Link 
                to="/scan"
                className={`transition-colors py-1 flex items-center gap-1 ${
                  pathname === '/scan' 
                    ? 'text-accent-red border-b-2 border-accent-red font-bold' 
                    : 'text-action-dark hover:text-accent-red'
                }`}
              >
                VISUAL SEARCH
              </Link>
            </>
          ) : (
            <Link 
              to="/admin"
              className="text-accent-red border-b-2 border-accent-red font-bold py-1"
            >
              ADMIN PORTAL
            </Link>
          )}
        </nav>

        {/* Utility Icons */}
        <div className="flex items-center gap-3 md:gap-5 text-action-dark">
          {!isAdmin && (
            <>
              <Link 
                to="/scan"
                className="p-2 hover:text-accent-red transition-all hover:scale-115"
                title="Scan Sneakers"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
              </Link>

              <Link 
                to="/cart"
                className="p-2 hover:text-accent-red transition-all relative hover:scale-115"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-red text-white font-display text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-brand-bg shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          <Link 
            to={userLoggedIn ? "/profile" : "/login"}
            className={`p-2 transition-all hover:scale-115 ${
              userLoggedIn 
                ? 'text-accent-red' 
                : 'hover:text-accent-red'
            }`}
            title={userLoggedIn ? 'Profile settings' : 'Login'}
          >
            <User className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </header>
  );
};
