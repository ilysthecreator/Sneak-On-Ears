import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingBag, Heart, Compass, ShieldCheck } from 'lucide-react';
import { Sneaker, CartItem, User, formatIDR } from '../types';

interface DetailViewProps {
  sneakers: Sneaker[];
  addToCart: (item: CartItem) => void;
  savedPairs: string[];
  toggleSavePair: (id: string) => void;
  user: User | null;
}

export const DetailView: React.FC<DetailViewProps> = ({
  sneakers,
  addToCart,
  savedPairs,
  toggleSavePair,
  user
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find sneaker by URL ID
  const sneaker = sneakers.find((s) => s.id === id);

  const [selectedSize, setSelectedSize] = useState<number>(
    sneaker ? sneaker.sizes[2] || 9 : 9
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // If sneaker is not found, render a clean error state
  if (!sneaker) {
    return (
      <div className="text-center py-24 select-none font-sans font-medium">
        <h2 className="font-display text-4xl md:text-5xl font-black text-action-dark uppercase tracking-tighter">
          CORE GEAR NOT FOUND
        </h2>
        <p className="text-text-muted text-xs md:text-sm mt-3 uppercase tracking-widest">
          The requested sneaker drop is retired or missing from the stack.
        </p>
        <button 
          onClick={() => navigate('/shop')} 
          className="mt-8 bg-action-dark text-white py-4 px-10 hover:bg-accent-red transition-all cursor-pointer font-display text-xs font-bold uppercase tracking-widest"
        >
          RETURN TO DOCKS
        </button>
      </div>
    );
  }

  const images = sneaker.gallery.length > 0 ? sneaker.gallery : [sneaker.image];
  const isSaved = savedPairs.includes(sneaker.id);

  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in to add drops to your game bag.");
      navigate('/login');
      return;
    }

    const newItem: CartItem = {
      sneaker,
      size: selectedSize,
      quantity: 1,
      selectedColor: sneaker.color
    };

    addToCart(newItem);
    setAddedAnimation(true);

    // After animation, route directly to Cart
    setTimeout(() => {
      setAddedAnimation(false);
      navigate('/cart');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 pb-16 relative">
      
      {/* Dynamic Checkout Toast Alert */}
      <AnimatePresence>
        {addedAnimation && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-action-dark text-white border-2 border-accent-red font-display text-sm uppercase py-4 px-8 tracking-widest z-50 flex items-center gap-3 shadow-2xl"
          >
            <div className="w-2.5 h-2.5 bg-accent-red rounded-full animate-ping"></div>
            <span>ADDED SECURELY • GEAR LOCKED!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header Back-trigger */}
      <div className="flex justify-between items-center border-b-2 border-action-dark/15 pb-4">
        <button 
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase text-action-dark hover:text-accent-red transition-all cursor-pointer p-1"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          Back to Drops catalogue
        </button>
        <span className="font-display text-[11px] font-extrabold text-text-muted uppercase tracking-[0.2em]">
          CATALOG SPOTLIGHT // {sneaker.id.replace(/-/g, ' ')}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mt-4">
        
        {/* Left Aspect - Interactive Spotlight Camera gallery */}
        <div className="w-full lg:w-3/5 bg-white border-2 border-action-dark rounded-none p-6 md:p-10 relative flex flex-col items-center justify-center shadow-md min-h-[480px]">
          
          {/* Subtle design diagonal slash back-plate */}
          <div className="absolute inset-0 bg-linear-to-br from-surface-container-low to-white z-0 pointer-events-none"></div>

          {/* Active Primary Sneaker Display */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center z-10 py-6">
            <motion.img 
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.93, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              alt={sneaker.name} 
              src={images[selectedImageIndex]} 
              className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] contrast-105"
            />
          </div>

          {/* Thumbnails Perspective Selector Grid */}
          {images.length > 1 && (
            <div className="relative z-10 flex gap-3 mt-4 pt-4 border-t border-action-dark/10 w-full justify-center">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 bg-surface-container border-2 rounded-none p-1 transition-all cursor-pointer ${
                    selectedImageIndex === idx 
                      ? 'border-accent-red scale-105 scale-y-105' 
                      : 'border-action-dark/10 opacity-60 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <img src={imgUrl} alt={`angle ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Visual technology highlight card watermark */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 font-display text-[9px] font-bold tracking-widest text-text-muted text-left">
            <Compass className="w-3.5 h-3.5 text-accent-red" />
            3D SCANPERSPECTIVE CALIBRATED
          </div>
        </div>

        {/* Right Aspect - Meta Specifications card form */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6 justify-between my-2 text-left">
          
          {/* Header titles */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-start gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-action-dark leading-none">
                {sneaker.name}
              </h2>

              {/* Saved trigger */}
              <button 
                onClick={() => toggleSavePair(sneaker.id)}
                className={`p-2 border-2 border-action-dark transition-colors ${
                  isSaved 
                    ? 'bg-accent-red/10 border-accent-red text-accent-red' 
                    : 'bg-white text-text-muted hover:text-action-dark hover:border-action-dark'
                }`}
              >
                <Heart className="w-5 h-5 stroke-[2.5]" fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <span className="font-display text-2xl font-black text-action-dark tracking-wider">
                {formatIDR(sneaker.price)}
              </span>
              <span className="text-[11px] font-semibold bg-action-dark text-white px-2.5 py-0.5 rounded-none font-display tracking-widest">
                VERIFIED CORES
              </span>
            </div>
          </div>

          {/* Core Technical summary block quote */}
          <div className="border-l-4 border-accent-red pl-4 bg-white py-3 pr-2 shadow-sm">
            <p className="font-sans text-xs md:text-sm text-text-main font-medium leading-relaxed italic">
              "{sneaker.description}"
            </p>
          </div>

          {/* Interactive specification rows */}
          <div className="grid grid-cols-2 gap-4 border-y-2 border-action-dark/10 py-4 font-display text-xs">
            <div>
              <span className="text-text-muted font-semibold uppercase tracking-wider block">COLORWAY:</span>
              <span className="text-action-dark font-extrabold uppercase mt-0.5 block">{sneaker.color}</span>
            </div>
            <div>
              <span className="text-text-muted font-semibold uppercase tracking-wider block">DROP SEQUENCE:</span>
              <span className="text-accent-red font-extrabold uppercase mt-0.5 block">VOL. 4 / LIMITED</span>
            </div>
          </div>

          {/* Size Dimensions Grid Selector */}
          <div>
            <div className="flex justify-between items-end mb-2.5">
              <h3 className="font-display text-xs font-black uppercase tracking-widest text-action-dark">
                SELECT SIZE (US MEN)
              </h3>
              <a 
                href="#sizeguide" 
                onClick={(e) => {
                  e.preventDefault();
                  alert("Court Fitting Guide:\nThese sneakers fit true-to-size. For a locked-in game fit, select your standard US Men's athletic size.");
                }} 
                className="font-sans text-[11px] text-text-muted font-bold underline decoration-text-muted underline-offset-2 hover:text-accent-red transition-all"
              >
                Size Guide
              </a>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {sneaker.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 flex items-center justify-center font-display text-sm font-bold border-2 border-action-dark transition-all rounded-none cursor-pointer ${
                      isSelected
                        ? 'bg-action-dark text-white shadow-md scale-102 border-action-dark'
                        : 'bg-white text-action-dark hover:border-accent-red hover:text-accent-red'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction Value additions safety labels */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-1.5 font-display text-[10px] font-bold text-text-muted">
              <ShieldCheck className="w-4 h-4 text-green-600 stroke-[2.5]" />
              SECURE LOCKOUT INCLUDES FULL INSOLE SENSORS
            </div>
          </div>

          {/* Secure Purchase trigger */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-3 bg-action-dark text-white hover:bg-accent-red font-display text-base md:text-lg font-bold uppercase tracking-widest py-4.5 rounded-none cursor-pointer transition-colors duration-300 shadow-xl"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              BUY NOW • GET READY
            </motion.button>
          </div>

        </div>

      </div>

    </div>
  );
};
