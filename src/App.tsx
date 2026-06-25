import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CartItem, Sneaker, User } from './types';
import { SNEAKERS_DATA } from './data';
import { Header } from './components/Header';
import { IntroView } from './components/IntroView';
import { LoginView } from './components/LoginView';
import { ShopView } from './components/ShopView';
import { DetailView } from './components/DetailView';
import { CartView } from './components/CartView';
import { VisualSearchView } from './components/VisualSearchView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { ArticlesView } from './components/ArticlesView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { Footer } from './components/Footer';
import { api } from './api';

// Import Icons from lucide-react for the bottom mobile navigation pill
import { Flame, Heart, ShoppingBag, Compass, ShieldAlert } from 'lucide-react';

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [sneakers, setSneakers] = useState<Sneaker[]>(SNEAKERS_DATA);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker>(SNEAKERS_DATA[0]);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sneak_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [savedPairs, setSavedPairs] = useState<string[]>([]);

  const userLoggedIn = !!user;
  const userId = user?.id;

  // 1. Fetch sneakers catalog from database on mount
  useEffect(() => {
    api.getSneakers()
      .then((data) => {
        if (data && data.length > 0) {
          setSneakers(data);
          setSelectedSneaker(data[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching sneakers catalog:', err);
      });
  }, []);

  // 2. Fetch user cart, saved pairs, and sync role from database when user is loaded
  useEffect(() => {
    if (user) {
      api.getProfile(user.id)
        .then((profile) => {
          if (profile.role && profile.role !== user.role) {
            const updated = { ...user, role: profile.role };
            setUser(updated);
            localStorage.setItem('sneak_user', JSON.stringify(updated));
          }
        })
        .catch((err) => console.error('Error syncing user profile details:', err));

      api.getSaved(user.id)
        .then((saved) => {
          setSavedPairs(saved.map((s) => s.id));
        })
        .catch((err) => console.error('Error fetching saved pairs:', err));

      api.getCart(user.id)
        .then((cartData) => {
          setCart(cartData);
        })
        .catch((err) => console.error('Error loading user cart:', err));
    } else {
      setCart([]);
      setSavedPairs([]);
    }
  }, [userId]);

  // Function to add item to Cart securely
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.sneaker.id === newItem.sneaker.id && item.size === newItem.size
      );
      let updated;
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        updated = copy;
      } else {
        updated = [...prev, newItem];
      }

      if (user) {
        api.syncCart(user.id, updated).catch((err) => console.error('Error syncing cart:', err));
      }
      return updated;
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

      if (user) {
        api.syncCart(user.id, copy).catch((err) => console.error('Error syncing cart:', err));
      }
      return copy;
    });
  };

  // Function to remove item completely from the Cart
  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const copy = prev.filter((_, idx) => idx !== index);
      if (user) {
        api.syncCart(user.id, copy).catch((err) => console.error('Error syncing cart:', err));
      }
      return copy;
    });
  };

  // Function to clear Cart upon checkout completion
  const clearCart = () => {
    setCart([]);
    if (user) {
      api.syncCart(user.id, []).catch((err) => console.error('Error clearing cart on server:', err));
    }
  };

  // Function to toggle saved/favorite items
  const toggleSavePair = (id: string) => {
    setSavedPairs((prev) => {
      const isSaved = prev.includes(id);
      const updated = isSaved ? prev.filter((p) => p !== id) : [...prev, id];
      
      if (user) {
        api.toggleSaved(user.id, id).catch((err) => console.error('Error toggling saved pair:', err));
      }
      return updated;
    });
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('sneak_user', JSON.stringify(loggedInUser));
    if (loggedInUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/shop');
    }
  };

  // Redirect admin users to command deck if they try to access customer pages
  useEffect(() => {
    if (user && user.role === 'admin' && pathname !== '/admin' && pathname !== '/profile') {
      navigate('/admin');
    }
  }, [user, pathname, navigate]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sneak_user');
    setCart([]);
    setSavedPairs([]);
    navigate('/');
  };

  const refreshCatalog = () => {
    api.getSneakers()
      .then((data) => {
        if (data && data.length > 0) {
          setSneakers(data);
        }
      })
      .catch((err) => console.error('Error refreshing sneaker catalog:', err));
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
          userRole={user?.role}
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
            <Route path="/login" element={<LoginView onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/shop" element={<ShopView sneakers={sneakers} setSelectedSneaker={setSelectedSneaker} savedPairs={savedPairs} toggleSavePair={toggleSavePair} />} />
            <Route path="/shop/:id" element={<DetailView sneakers={sneakers} addToCart={addToCart} savedPairs={savedPairs} toggleSavePair={toggleSavePair} user={user} />} />
            <Route path="/cart" element={<CartView cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} user={user} />} />
            <Route path="/scan" element={<VisualSearchView sneakers={sneakers} setSelectedSneaker={setSelectedSneaker} />} />
            <Route path="/profile" element={<ProfileView user={user} onLogout={handleLogout} />} />
            <Route path="/articles" element={<ArticlesView />} />
            <Route path="/articles/:id" element={<ArticleDetailView />} />
            <Route path="/admin" element={<AdminView user={user} onSneakerAdded={refreshCatalog} />} />
            {/* Fallback route for sub-pages */}
            <Route path="*" element={<Navigate to="/shop" replace />} />
          </Routes>
        </div>
      )}

      {/* 3. Floating Mobile Bottom Pill Bar (Pencil indicator bar inside frame constraints) */}
      {pathname !== '/' && pathname !== '/login' && user?.role !== 'admin' && (
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

          {/* Admin Command Deck (Only visible if role === 'admin') */}
          {user?.role === 'admin' && (
            <button 
              type="button"
              onClick={() => navigate('/admin')}
              className={`flex flex-col items-center justify-center relative cursor-pointer ${
                pathname === '/admin' ? 'text-white scale-110' : 'text-text-muted/65'
              }`}
            >
              <ShieldAlert className="w-5 h-5 stroke-[2.5] text-accent-red" />
              <span className="font-display text-[9px] font-bold uppercase tracking-widest mt-0.5">ADMIN</span>
              {pathname === '/admin' && (
                <span className="absolute -bottom-1 h-1 w-1 bg-accent-red rounded-full"></span>
              )}
            </button>
          )}

        </nav>
      )}

      {/* 4. Global Footer (Suppressed on splash page and login page) */}
      {pathname !== '/' && pathname !== '/login' && <Footer />}

    </div>
  );
}
