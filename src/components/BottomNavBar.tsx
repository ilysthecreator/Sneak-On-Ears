import { motion } from 'motion/react';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { ActivePage } from '../types';

interface BottomNavBarProps {
  activePage: ActivePage;
  onNavigateToPage: (page: ActivePage) => void;
  cartCount: number;
}

export default function BottomNavBar({ activePage, onNavigateToPage, cartCount }: BottomNavBarProps) {
  const tabs = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'search', label: 'Search', icon: Search },
    { key: 'cart', label: 'Cart', icon: ShoppingBag, badge: true },
    { key: 'profile', label: 'Profile', icon: User }
  ];

  // If we are on Splash or Login page, we hide the Bottom Nav
  if (activePage === 'splash' || activePage === 'login') {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-6 pointer-events-none select-none">
      <div className="max-w-[400px] mx-auto bg-black border-2 border-stone-800 rounded-full p-2 px-3 shadow-[0_12px_24px_rgba(0,0,0,0.3)] flex justify-between items-center pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.key || (tab.key === 'home' && activePage === 'detail');
          
          return (
            <button
              key={tab.key}
              onClick={() => onNavigateToPage(tab.key as ActivePage)}
              className="relative flex items-center justify-center p-3 rounded-full cursor-pointer transition-all outline-none focus:outline-none select-none"
              style={{ minWidth: '48px', minHeight: '48px' }}
              title={tab.label}
            >
              {/* Highlight background transition indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon 
                  className={`w-5.5 h-5.5 transition-colors duration-200 stroke-[2] ${
                    isActive ? 'text-white scale-110' : 'text-stone-400 hover:text-white'
                  }`} 
                />

                {/* Shopping trolley quant badge notifier */}
                {tab.badge && cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#8B0000] text-white font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black leading-none"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
