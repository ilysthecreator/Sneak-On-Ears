import { motion } from 'motion/react';
import { ShoppingBag, Zap } from 'lucide-react';

interface SplashViewProps {
  onEnter: () => void;
}

export default function SplashView({ onEnter }: SplashViewProps) {
  return (
    <div className="relative w-full min-h-screen bg-[#111111] text-[#E5E5E5] flex flex-col justify-between overflow-hidden noise-overlay select-none">
      {/* Background Marquee Text Structure Grid */}
      <div className="absolute inset-0 flex flex-col justify-between py-12 opacity-5 pointer-events-none font-display text-8xl font-black uppercase tracking-tighter leading-none select-none">
        <div>HOOPS</div>
        <div>STREET</div>
        <div>HEAVEN</div>
        <div>LEGENDS</div>
        <div>HOOPS</div>
        <div>STREET</div>
        <div>HEAVEN</div>
      </div>

      {/* Aesthetic Red Accent Triangle at top corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B0000] skewed-triangle-reverse opacity-40"></div>

      {/* Top Header */}
      <div className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-1">
          <Zap className="text-[#8B0000] fill-[#8B0000] w-5 h-5" />
          <span className="font-mono text-xs tracking-widest font-bold">EST. 2026</span>
        </div>
        <span className="font-mono text-xs text-stone-500">JAKARTA COPPERS</span>
      </div>

      {/* Center Brand Identity */}
      <div className="p-6 flex flex-col items-center justify-center text-center z-10 flex-grow">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-6"
        >
          {/* Logo Badge Shadow */}
          <div className="absolute -inset-1 bg-red-800 rounded-none blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          
          <div className="relative bg-[#111111] border-4 border-[#E5E5E5] p-6 px-10 flex flex-col items-center">
            <span className="font-display text-4xl font-extrabold uppercase tracking-widest text-[#E5E5E5] leading-none mb-1">
              SNEAK
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-[#8B0000] text-white font-display px-2 py-0.5 text-lg font-bold tracking-wider">ON</span>
              <span className="font-display text-4xl font-extrabold uppercase tracking-widest text-[#E5E5E5] leading-none">
                EARS
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl tracking-[0.25em] text-red-600 uppercase font-black">
            HEAVEN OF HOOPERS
          </h2>
          <p className="font-sans text-xs text-stone-400 mt-2 max-w-[280px] leading-relaxed mx-auto">
            Where elite traction meets pure streetwear culture. Grab the ultimate grip for your court domination.
          </p>
        </motion.div>
      </div>

      {/* Boot sneaker preview and Enter Button */}
      <div className="p-6 flex flex-col items-center z-10 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative w-72 h-44 mb-6 flex items-center justify-center"
        >
          {/* Neon Grid Light */}
          <div className="absolute bottom-2 w-48 h-4 bg-[#8B0000]/30 rounded-full blur-xl animate-pulse"></div>
          <img
            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600"
            alt="Landing Shoe"
            className="w-full h-full object-contain mix-blend-screen transform -rotate-12 select-none pointer-events-none"
          />
        </motion.div>

        <motion.button
          onClick={onEnter}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-[#E5E5E5] text-black font-display text-lg tracking-wider font-extrabold py-4 px-6 relative overflow-hidden group border border-[#E5E5E5] cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#8B0000] skewed-triangle-reverse"></div>
          <span className="relative z-10 flex items-center justify-center gap-2 uppercase">
            ENTER ARENA <ShoppingBag className="w-5 h-5 fill-black text-white" />
          </span>
        </motion.button>
        <div className="mt-4 font-mono text-[10px] text-stone-500 tracking-wider uppercase">
          Swipe or TAP to Proceed
        </div>
      </div>
    </div>
  );
}
