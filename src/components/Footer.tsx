import React from 'react';
import { Sparkles, Flame, Star } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-action-dark text-white border-t-2 border-action-dark mt-auto select-none font-sans">
      {/* Main Brand Values Banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        {/* Value 1 */}
        <div className="flex flex-col gap-3 group">
          <div className="inline-flex items-center gap-2.5 font-display text-sm font-bold tracking-widest uppercase text-accent-red group-hover:text-white transition-colors duration-300">
            <div className="p-1.5 bg-accent-red text-white rounded-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            LIMITED CORES ONLY
          </div>
          <p className="text-xs text-brand-bg/75 leading-relaxed font-medium tracking-wide">
            We operate exclusively in drops. No massive restocks, no over-production, no watered-down releases. Once the stock finishes, the code is retired.
          </p>
        </div>

        {/* Value 2 */}
        <div className="flex flex-col gap-3 group border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0 md:px-8">
          <div className="inline-flex items-center gap-2.5 font-display text-sm font-bold tracking-widest uppercase text-accent-red group-hover:text-white transition-colors duration-300">
            <div className="p-1.5 bg-accent-red text-white rounded-sm">
              <Flame className="w-4 h-4" />
            </div>
            ASPHALT OUTLINE
          </div>
          <p className="text-xs text-brand-bg/75 leading-relaxed font-medium tracking-wide">
            Every sneaker we host carries reinforced outsole panels designed deliberately for friction grids on asphalt city courts. Durable streetwear modernism.
          </p>
        </div>

        {/* Value 3 */}
        <div className="flex flex-col gap-3 group">
          <div className="inline-flex items-center gap-2.5 font-display text-sm font-bold tracking-widest uppercase text-accent-red group-hover:text-white transition-colors duration-300">
            <div className="p-1.5 bg-accent-red text-white rounded-sm">
              <Star className="w-4 h-4" />
            </div>
            ELITE PLAY SYNC
          </div>
          <p className="text-xs text-brand-bg/75 leading-relaxed font-medium tracking-wide">
            Our app active status integrations let you sync physical calorie metrics directly. Reach Elite Hooper level by stepping onto real concrete courts.
          </p>
        </div>

      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-white/10 bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-display tracking-widest uppercase font-bold text-text-muted">
          <div>
            © 2026 SNEAK ON EARS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">TERMS OF COURT</a>
            <span className="text-white/10">•</span>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">PRIVACY CODE</a>
            <span className="text-white/10">•</span>
            <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">DOCK SYSTEM</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
