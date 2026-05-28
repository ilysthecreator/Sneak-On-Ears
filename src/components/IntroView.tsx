import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const IntroView: React.FC = () => {
  const navigate = useNavigate();
  const [bgText, setBgText] = useState('');

  useEffect(() => {
    // Generate enough repeating texts to fill user viewport fully
    const textPattern = 'HEAVEN OF HOOPERS • ';
    setBgText(textPattern.repeat(350));
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-brand-bg select-none py-12">
      {/* Repeating Slanted Text Grid Pattern backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.035] font-display text-7xl md:text-9xl font-black text-black leading-none break-all select-none overflow-hidden text-left rotate-[-8deg] scale-125 translate-y-[-10%] origin-center">
        {bgText}
      </div>

      {/* Decorative Top Left Tech Indicators */}
      <div className="absolute top-8 left-8 hidden md:block z-20">
        <div className="w-16 h-2.5 bg-action-dark mb-1"></div>
        <div className="w-8 h-1 bg-accent-red"></div>
      </div>



      {/* Main content viewport */}
      <motion.main 
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center"
      >


        {/* Brand Display header */}
        <h1 className="font-display text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-action-dark leading-[0.85] select-text">
          SNEAK <br />
          ON EARS
        </h1>

        {/* Description caption */}
        <p className="mt-6 font-display text-sm md:text-base font-extrabold uppercase tracking-[0.3em] text-text-muted max-w-md">
          The Heaven of Hoopers
        </p>

        {/* Central visual activator */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-12 group relative"
        >
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center justify-center bg-action-dark text-white font-display text-xl md:text-2xl font-bold uppercase tracking-wide px-12 py-5 rounded-none cursor-pointer transition-colors duration-300 group-hover:bg-accent-red relative z-10 shadow-2xl"
          >
            ENTER THE SHOP
            <ArrowRight className="w-6 h-6 ml-4 transition-transform duration-300 group-hover:translate-x-2 stroke-[2.5]" />
          </button>
          
          {/* Brutalist red background shadow block */}
          <div className="absolute inset-0 bg-accent-red translate-x-1.5 translate-y-1.5 z-0 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300"></div>
        </motion.div>

        {/* Quality statement footer */}
        <p className="mt-6 font-display text-[11px] md:text-xs font-semibold text-text-muted uppercase tracking-[0.4em] opacity-85">
          NO COMPROMISE. BUILT FOR PERFORMANCE.
        </p>
      </motion.main>
    </div>
  );
};
