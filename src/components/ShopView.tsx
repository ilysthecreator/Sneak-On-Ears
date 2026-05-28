import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Star, Sliders, Check, Search, Sparkles, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sneaker } from '../types';
import { SNEAKERS_DATA } from '../data';

interface ShopViewProps {
  setSelectedSneaker: (sneaker: Sneaker) => void;
  savedPairs: string[];
  toggleSavePair: (id: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  setSelectedSneaker,
  savedPairs,
  toggleSavePair
}) => {
  const navigate = useNavigate();
  const [filterColor, setFilterColor] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero slider states
  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handlePrev = () => {
    setDirection(-1);
    setHeroIndex((prev) => (prev === 0 ? SNEAKERS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setHeroIndex((prev) => (prev === SNEAKERS_DATA.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 250 : -250,
      opacity: 0,
      scale: 0.9,
      rotate: direction > 0 ? 8 : -8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1.4,
      rotate: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
        rotate: { duration: 0.25 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 250 : -250,
      opacity: 0,
      scale: 0.9,
      rotate: direction < 0 ? 8 : -8,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        rotate: { duration: 0.2 }
      }
    })
  };

  // Setup simple brutalist filtering
  const colorsList = ['All', 'Blood Red', 'White', 'Black', 'Green', 'Neon'];

  const filteredSneakers = SNEAKERS_DATA.filter(sneaker => {
    const matchesSearch = sneaker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sneaker.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterColor === 'All') return matchesSearch;
    return matchesSearch && sneaker.color.toLowerCase().includes(filterColor.toLowerCase());
  });

  const handleSelectSneaker = (sneaker: Sneaker) => {
    setSelectedSneaker(sneaker);
    navigate(`/shop/${sneaker.id}`);
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      
      {/* Hero Masterpiece Section */}
      <section 
        onClick={() => {
          const currentHero = SNEAKERS_DATA[heroIndex];
          if (currentHero) handleSelectSneaker(currentHero);
        }}
        className="relative w-full h-[550px] md:h-[650px] bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-lg border-2 border-action-dark/10 cursor-pointer group"
      >
        {/* Brutalist slash Crimson background strip */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-brand-bg opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-[160%] h-[160%] bg-accent-red transform rotate-12 translate-x-1/3 translate-y-1/3 transition-transform duration-700 group-hover:scale-105"></div>
        </div>

        {/* Big Background Display Heading with Blend Mode */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-12 pb-20 md:pt-14 md:pb-24 px-8 text-center select-none">
          <h2 className="font-display text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter mix-blend-difference leading-none select-none">
            HEAVEN OF <br className="md:hidden" /> HOOPERS
          </h2>
          
          {/* Main Hero Sneaker Float Illustration */}
          <div className="w-full max-w-sm md:max-w-2xl my-auto relative flex items-center justify-center h-[280px] md:h-[380px] filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img 
                key={heroIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                alt={SNEAKERS_DATA[heroIndex].name}
                className="w-full h-full object-contain"
                src={SNEAKERS_DATA[heroIndex].image}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows for Slider */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 md:left-8 z-30 p-2.5 bg-action-dark hover:bg-accent-red text-white border-2 border-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer group/btn"
          aria-label="Previous Drop"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 md:right-8 z-30 p-2.5 bg-action-dark hover:bg-accent-red text-white border-2 border-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer group/btn"
          aria-label="Next Drop"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

        {/* Lower Left Indicator Tags */}
        <div className="absolute bottom-6 left-6 md:left-8 z-20 text-white mix-blend-difference font-display">
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase">Latest Drop / {SNEAKERS_DATA[heroIndex].name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-80">{SNEAKERS_DATA[heroIndex].color} • {SNEAKERS_DATA[heroIndex].badge || 'ACTIVE'}</span>
          </div>
        </div>

        {/* Floating action indicator banner */}
        <div className="absolute bottom-6 right-6 md:right-8 z-20 bg-action-dark text-white px-4 py-2 font-display text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md flex items-center gap-1 group-hover:bg-accent-red transition-all cursor-pointer">
          <span>BUY CORES</span>
          <span className="text-xs font-black">→</span>
        </div>
      </section>

      {/* Brutalist Utility / Filter bar selection */}
      <section className="bg-white border-2 border-action-dark p-6 rounded-none flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="font-display text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 text-action-dark">
            <Sliders className="w-4 h-4 stroke-[2.5]" />
            Colorway:
          </span>
          <div className="flex flex-wrap gap-2">
            {colorsList.map((color) => (
              <button
                key={color}
                onClick={() => setFilterColor(color)}
                className={`px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider rounded-none cursor-pointer transition-all ${
                  filterColor === color
                    ? 'bg-action-dark text-white'
                    : 'bg-brand-bg hover:bg-surface-container text-action-dark border border-action-dark/10'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Search inputs inside filter block */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted stroke-[2.5]" />
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-brand-bg text-action-dark font-display font-semibold text-xs rounded-none border border-black/10 focus:border-action-dark uppercase tracking-widest outline-none"
          />
        </div>
      </section>

      {/* Stores Bento Catalog Header */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end border-b-4 border-action-dark pb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-3xl font-black italic uppercase tracking-tighter text-action-dark">
              FRESH DROPS
            </h3>
            <span className="font-display text-xs font-semibold bg-accent-red text-white py-0.5 px-2">
              {filteredSneakers.length} MATCHES
            </span>
          </div>
          <button 
            onClick={() => {
              setFilterColor('All');
              setSearchQuery('');
            }}
            className="font-display text-xs font-bold text-action-dark hover:text-accent-red transition-all cursor-pointer border-b-2 border-action-dark hover:border-accent-red pb-0.5 tracking-widest uppercase"
          >
            RESET DISCOVER
          </button>
        </div>

        {/* Brutalist Bento-style grid */}
        {filteredSneakers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {filteredSneakers.map((sneaker, index) => {
              const isSaved = savedPairs.includes(sneaker.id);
              // Asymmetric layout rules: strider pro is taller / takes double size when index % 3
              const isFeaturedStrider = sneaker.id === 'shadow-strider-pro';

              return (
                <div 
                  key={sneaker.id}
                  className={`bg-white group flex flex-col justify-between border-2 border-action-dark py-5 px-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    isFeaturedStrider ? 'lg:col-span-1 lg:row-span-1' : ''
                  }`}
                >
                  
                  {/* Image wrapper */}
                  <div 
                    onClick={() => handleSelectSneaker(sneaker)}
                    className="relative w-full aspect-square mb-5 bg-surface-container-low flex items-center justify-center p-3 group-hover:bg-surface-container transition-colors duration-400 overflow-hidden"
                  >
                    {/* Background decorations for asymmetric design */}
                    {isFeaturedStrider && (
                      <div className="absolute inset-0 bg-accent-red/10 transform -skew-y-12 scale-150 transition-transform duration-500 group-hover:scale-170"></div>
                    )}

                    {/* Shoe image */}
                    <img 
                      alt={sneaker.name} 
                      src={sneaker.image} 
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:-translate-y-2 group-hover:scale-106 transition-all duration-500 ease-out z-10"
                    />

                    {/* Badge Indicators */}
                    {sneaker.badge && (
                      <div className="absolute top-2 left-2 bg-action-dark text-white px-2 py-0.5 font-display text-[9px] font-bold tracking-widest uppercase shadow-sm z-20">
                        {sneaker.badge}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer details */}
                  <div className="mt-auto flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <h4 
                        onClick={() => handleSelectSneaker(sneaker)}
                        className="font-display text-sm md:text-base font-extrabold uppercase text-action-dark group-hover:text-accent-red transition-colors tracking-tight leading-tight cursor-pointer"
                      >
                        {sneaker.name}
                      </h4>

                      {/* Sparkle favorites trigger */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavePair(sneaker.id);
                        }}
                        className={`p-1 border border-transparent rounded-sm hover:border-action-dark/10 transition-all ${
                          isSaved ? 'text-accent-red' : 'text-text-muted hover:text-action-dark'
                        }`}
                        title={isSaved ? "Saved to Cores" : "Save to Cores"}
                      >
                        <Heart className="w-4 h-4 stroke-[2.5]" fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Brief description detail */}
                    <p className="text-[11px] text-text-muted line-clamp-2 mt-1 leading-normal font-medium">
                      {sneaker.description}
                    </p>

                    {/* price row */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-action-dark/5">
                      <span className="font-display text-xl font-bold tracking-wider text-action-dark">
                        ${sneaker.price}
                      </span>
                      <button 
                        onClick={() => handleSelectSneaker(sneaker)}
                        className="font-display text-[10px] font-bold uppercase tracking-widest bg-action-dark hover:bg-accent-red text-white py-1.5 px-3 transition-colors cursor-pointer"
                      >
                        VIEW SPOT
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-action-dark/30 p-16 text-center shadow-inner">
            <Flame className="w-12 h-12 text-text-muted mx-auto animate-bounce opacity-40 mb-3" />
            <p className="font-display text-lg font-bold uppercase text-active-dark tracking-wide">
              NO MATCHING CORES IN THE STACK
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
              Our hoop catalog updates weekly. Try broad terms like "White", "Green", "Black", or key shoe terms.
            </p>
            <button
              onClick={() => {
                setFilterColor('All');
                setSearchQuery('');
              }}
              className="mt-6 font-display text-xs font-bold text-white bg-action-dark py-2 px-6 hover:bg-accent-red transition-all cursor-pointer"
            >
              SHOW ALL CORES
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
