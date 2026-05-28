import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Zap, Star, ChevronRight, ArrowRight, Flame } from 'lucide-react';
import { Product } from '../types';
import { SHOES_DATA } from '../data';

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToPage: (page: 'splash' | 'login' | 'home' | 'detail' | 'search' | 'cart' | 'profile') => void;
  userName: string;
}

export default function HomeView({ onSelectProduct, onNavigateToPage, userName }: HomeViewProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featuredShoes = SHOES_DATA.slice(0, 3);

  // Auto-rotate hero section carousel for lively vibes
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredShoes.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [featuredShoes.length]);

  const categories = ['All', 'Max Cushioned', 'Court Feel', 'Explosive Spring', 'Speed & Agility', 'Minimalist Hoop'];

  const filteredShoes = activeCategory === 'All'
    ? SHOES_DATA
    : SHOES_DATA.filter(shoe => shoe.category === activeCategory);

  return (
    <div className="w-full flex flex-col pb-32 pt-4 bg-[#E5E5E5] text-[#111111] font-sans selection:bg-black selection:text-white">
      
      {/* Upper Status Line & Personal Greetings */}
      <div className="px-6 flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#666666]">
            Welcome Player
          </span>
          <span className="font-display text-lg font-black tracking-tight leading-none text-[#111111] uppercase">
            {userName || 'GUEST HOOPER'}
          </span>
        </div>
        <button 
          onClick={() => onNavigateToPage('profile')}
          className="flex items-center gap-1.5 p-1 px-3 bg-black text-white rounded-none border border-black cursor-pointer hover:bg-[#8B0000] transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-[#8B0000] fill-[#8B0000]" />
          <span className="font-mono text-[9px] tracking-wider uppercase font-bold">JAKARTA COURT</span>
        </button>
      </div>

      {/* Styled Brutalist Search Redirect Input */}
      <div className="px-6 mb-5">
        <div 
          onClick={() => onNavigateToPage('search')}
          className="flex items-center gap-3 bg-white border-3 border-black p-3 shadow-[3px_3px_0px_#000000] cursor-pointer"
        >
          <Search className="w-5 h-5 text-[#111111]" />
          <span className="text-xs text-stone-500 font-mono tracking-wide flex-grow select-none">
            SEARCH SNEAKER OR UPLOAD PHOTO FOR ENGINE...
          </span>
          <span className="bg-[#111111] text-white text-[9px] font-mono px-2 py-0.5 tracking-wider font-bold">
            SCAN
          </span>
        </div>
      </div>

      {/* Hero Showcase Slide (Segment Carousel with Clip path diagonal triangular accent-red) */}
      <div className="px-6 mb-6">
        <div className="relative w-full h-64 sm:h-80 md:h-[350px] bg-[#111111] border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
          
          {/* Streetwear Red Accent Triangle */}
          <div className="absolute top-0 right-0 w-[45%] h-full bg-[#8B0000] skewed-triangle z-0 hidden sm:block"></div>
          
          {/* Repetitive "HEAVEN OF HOOPERS" Background Logo Accent */}
          <div className="absolute left-6 top-6 opacity-5 max-w-[200px] pointer-events-none font-display text-5xl leading-none font-black text-white">
            HOOPS<br/>HEAVEN<br/>01
          </div>

          <AnimatePresence mode="wait">
            {featuredShoes.map((shoe, idx) => {
              if (idx !== carouselIndex) return null;
              return (
                <motion.div
                  key={shoe.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10"
                >
                  <div className="flex flex-col z-10 max-w-sm">
                    <span className="bg-[#8B0000] text-white text-[9px] font-mono px-2.5 py-1 tracking-wider uppercase w-max font-bold">
                      🔥 TOP HEATS
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#E5E5E5] tracking-tight uppercase leading-none mt-2">
                      {shoe.name}
                    </h2>
                    <p className="font-mono text-xs text-stone-400 mt-1">
                      {shoe.category}
                    </p>
                    <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-widest mt-1.5">
                      Rp {(shoe.price / 1000000).toFixed(3)}.000
                    </p>
                  </div>

                  {/* Absolute Floating Shoes with Mix Blend Multiply to look raw transparent */}
                  <div className="absolute right-4 sm:right-12 bottom-6 w-60 sm:w-80 h-44 sm:h-56 flex items-center justify-center transform -rotate-12 select-none pointer-events-none">
                    {/* Shadow underneath shoe */}
                    <div className="absolute bottom-2 w-44 h-4 bg-black/40 rounded-full blur-md"></div>
                    <img
                      src={shoe.image}
                      alt={shoe.name}
                      className="w-full h-full object-contain filter drop-shadow(0px 10px 15px rgba(0,0,0,0.5))"
                      style={{ mixBlendMode: 'screen' }}
                    />
                  </div>

                  {/* Action Link Button */}
                  <div className="z-10 mt-auto">
                    <button
                      onClick={() => onSelectProduct(shoe)}
                      className="bg-[#E5E5E5] hover:bg-white text-black font-display text-xs font-black p-2.5 px-5 shadow-[3px_3px_0px_#8B0000] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>COP THIS SPEC</span>
                      <ArrowRight className="w-4 h-4 font-bold" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Carousel Dot Indicators */}
          <div className="absolute right-4 bottom-4 flex gap-1.5 z-20">
            {featuredShoes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`w-2.5 h-2.5 rounded-none border border-black cursor-pointer transition-colors ${idx === carouselIndex ? 'bg-white' : 'bg-white/25'}`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Slogan Ticker Marquee Band */}
      <div className="w-full bg-black text-white py-2 border-y-3 border-black marquee-container mb-6 select-none font-display flex overflow-hidden">
        <div className="marquee-content inline-block uppercase text-xs tracking-[0.2em] font-black whitespace-nowrap">
          HEAVEN OF HOOPERS • SNEAK ON EARS • STREET LEVEL TRACTION • OFF-WHITE STEEZ • KEBANGGAAN SNEAKER INDONESIA • HEAVEN OF HOOPERS • SNEAK ON EARS • STREET LEVEL TRACTION • OFF-WHITE STEEZ • KEBANGGAAN SNEAKER INDONESIA
        </div>
      </div>

      {/* Category Horizontal Scroll Filters */}
      <div className="mx-6 mb-5">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#666666] mb-2.5 font-bold">
          FILTER BY SPECIFICATION
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start flex-shrink-0 px-4 py-2 text-xs font-mono font-bold tracking-tight rounded-none border-2 border-black transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-black text-white shadow-[2px_2px_0px_#8B0000]'
                  : 'bg-white text-black hover:bg-stone-50'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Shoes list Grid */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-tight flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-[#8B0000] fill-[#8B0000]" />
            <span>AVAILABLE KICK STALWART</span>
          </h2>
          <span className="font-mono text-xs text-[#666666] font-bold">
            ({filteredShoes.length} FEEDS)
          </span>
        </div>

        {/* CSS GRID: Fully Responsive Grids for desktop website and mobile viewports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredShoes.map((shoe) => (
            <motion.div
              layout
              key={shoe.id}
              onClick={() => onSelectProduct(shoe)}
              className="bg-white border-3 border-black flex flex-col justify-between relative group cursor-pointer shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_#8B0000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all p-4"
            >
              {/* Star rating tag at upper left */}
              <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black text-[#E5E5E5] px-1.5 py-0.5 text-[9px] font-mono z-10">
                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                <span>{shoe.rating.toFixed(1)}</span>
              </div>

              {/* Shoe Category Badge */}
              <div className="absolute top-2 right-2 flex items-center z-10">
                <span className="border border-black bg-stone-100 text-[8px] font-mono px-1 py-0.2 uppercase text-stone-700">
                  {shoe.category.split(' ')[0]}
                </span>
              </div>

              {/* Main Shoe Image Container: Using mix-blend-multiply so shoe pops out from white card background */}
              <div className="w-full h-32 flex items-center justify-center py-2 relative select-none pointer-events-none mt-3">
                <div className="absolute bottom-2 w-20 h-2 bg-stone-300 rounded-full blur-md"></div>
                <img
                  src={shoe.image}
                  alt={shoe.name}
                  className="w-full h-full object-contain mix-blend-multiply transform transition-transform group-hover:scale-110 duration-300"
                />
              </div>

              {/* Product Information Footer */}
              <div className="border-t border-dashed border-stone-200 pt-2.5">
                <span className="block font-mono text-[9px] text-stone-400 uppercase tracking-tight">
                  {shoe.category}
                </span>
                <h3 className="font-display text-sm font-black text-[#111111] uppercase tracking-wide leading-tight mt-0.5 truncate group-hover:text-[#8B0000] transition-colors">
                  {shoe.name}
                </h3>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-display font-extrabold text-[#111111] leading-none text-sm tracking-wide">
                    Rp {(shoe.price / 1000000).toFixed(3)}.000
                  </span>
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs font-bold leading-none select-none group-hover:bg-[#8B0000] transition-colors">
                    +
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
