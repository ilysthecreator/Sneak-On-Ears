import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ViewMode, CartItem, Sneaker } from './types';
import { SNEAKERS_DATA } from './data';
import { Header } from './components/Header';
import { IntroView } from './components/IntroView';
import { LoginView } from './components/LoginView';
import { ShopView } from './components/ShopView';
import { DetailView } from './components/DetailView';
import { CartView } from './components/CartView';
import { VisualSearchView } from './components/VisualSearchView';
import { ProfileView } from './components/ProfileView';
import { Footer } from './components/Footer';

// Import Icons from lucide-react for the bottom mobile navigation pill
import { Flame, Heart, ShoppingBag, Compass, HelpCircle } from 'lucide-react';

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker>(SNEAKERS_DATA[0]);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [savedPairs, setSavedPairs] = useState<string[]>([]);

  // Function to add item to Cart securely
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Check if item already exists in the same size
      const existingIdx = prev.findIndex(
        (item) => item.sneaker.id === newItem.sneaker.id && item.size === newItem.size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
  };

  // Function to increment/decrement item quantities in the Cart
  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  // Function to remove item completely from the Cart
  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Function to clear Cart upon checkout completion
  const clearCart = () => {
    setCart([]);
  };

  // Function to toggle saved/favorite items
  const toggleSavePair = (id: string) => {
    setSavedPairs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
  };

  // Automatically scroll to the top of the body upon route switching
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg relative">
      
      {/* 1. Global Platform Navigation Header (Suppressed on splash page) */}
      {pathname !== '/' && (
        <Header 
          cart={cart}
          userLoggedIn={userLoggedIn}
        />
      )}

      {/* Routing Render Core */}
      {pathname === '/' ? (
        <Routes>
          <Route path="/" element={<IntroView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        /* 2. Primary Layout Workspace wrapper */
        <div className={`grow w-full max-w-7xl mx-auto px-4 md:px-8 pt-6 ${pathname !== '/login' ? 'pb-28 md:pb-6' : 'pb-6'}`}>
          <Routes>
            <Route path="/login" element={<LoginView setLoggedIn={setUserLoggedIn} />} />
            <Route path="/shop" element={<ShopView setSelectedSneaker={setSelectedSneaker} savedPairs={savedPairs} toggleSavePair={toggleSavePair} />} />
            <Route path="/shop/:id" element={<DetailView addToCart={addToCart} savedPairs={savedPairs} toggleSavePair={toggleSavePair} />} />
            <Route path="/cart" element={<CartView cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} />} />
            <Route path="/scan" element={<VisualSearchView setSelectedSneaker={setSelectedSneaker} />} />
            <Route path="/profile" element={<ProfileView setLoggedIn={setUserLoggedIn} />} />
            {/* Fallback route for sub-pages */}
            <Route path="*" element={<Navigate to="/shop" replace />} />
          </Routes>
        </div>
      )}

      {/* 3. Floating Mobile Bottom Pill Bar (Pencil indicator bar inside frame constraints) */}
      {pathname !== '/' && pathname !== '/login' && (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex shadow-2xl justify-around items-center h-16 px-4 bg-action-dark border-2 border-accent-red/20 rounded-full w-[90%] max-w-sm select-none">
          
          {/* Shop */}
          <button 
            type="button"
            onClick={() => navigate('/shop')}
            className={`flex flex-col items-center justify-center relative cursor-pointer ${
              pathname === '/shop' || pathname.startsWith('/shop/') ? 'text-white scale-110' : 'text-text-muted/65'
            }`}
          >
            <Compass className="w-5 h-5 stroke-[2.5]" />
            <span className="font-display text-[9px] font-bold uppercase tracking-widest mt-0.5">SHOP</span>
            {(pathname === '/shop' || pathname.startsWith('/shop/')) && (
              <span className="absolute -bottom-1 h-1 w-1 bg-accent-red rounded-full"></span>
            )}
          </button>

          {/* Scanner */}
          <button 
            type="button"
            onClick={() => navigate('/scan')}
            className={`flex flex-col items-center justify-center relative cursor-pointer ${
              pathname === '/scan' ? 'text-white scale-110' : 'text-text-muted/65'
            }`}
          >
            <Flame className="w-5 h-5 stroke-[2.5]" />
            <span className="font-display text-[9px] font-bold uppercase tracking-widest mt-0.5">SCAN</span>
            {pathname === '/scan' && (
              <span className="absolute -bottom-1 h-1 w-1 bg-accent-red rounded-full"></span>
            )}
          </button>

          {/* Cart with simple notifications counts */}
          <button 
            type="button"
            onClick={() => navigate('/cart')}
            className={`flex flex-col items-center justify-center relative cursor-pointer ${
              pathname === '/cart' ? 'text-white scale-110' : 'text-text-muted/65'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 h-2.5 w-2.5 bg-accent-red rounded-full ring-2 ring-black" />
              )}
            </div>
            <span className="font-display text-[9px] font-bold uppercase tracking-widest mt-0.5">BAG</span>
            {pathname === '/cart' && (
              <span className="absolute -bottom-1 h-1 w-1 bg-accent-red rounded-full"></span>
            )}
          </button>

          {/* Account Profile metrics */}
          <button 
            type="button"
            onClick={() => navigate(userLoggedIn ? '/profile' : '/login')}
            className={`flex flex-col items-center justify-center relative cursor-pointer ${
              pathname === '/profile' ? 'text-white scale-110' : 'text-text-muted/65'
            }`}
          >
            <div className="relative">
              <Heart className="w-5 h-5 stroke-[2.5]" />
              {savedPairs.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent-red text-white text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold">
                  {savedPairs.length}
                </span>
              )}
            </div>
            <span className="font-display text-[9px] font-bold uppercase tracking-widest mt-0.5">CORES</span>
            {pathname === '/profile' && (
              <span className="absolute -bottom-1 h-1 w-1 bg-accent-red rounded-full"></span>
            )}
          </button>

        </nav>
      )}

      {/* 4. Global Footer (Suppressed on splash page and login page) */}
      {pathname !== '/' && pathname !== '/login' && <Footer />}

    </div>
  );
}
