import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Flame, Timer, Receipt, CreditCard, MapPin, Settings, ChevronDown, User, LogOut, Check } from 'lucide-react';

interface ProfileViewProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [username, setUsername] = useState('Marcus Court');

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pb-16 relative font-sans text-left">
      
      {/* Profile Header Block */}
      <section className="flex flex-col items-center justify-center text-center gap-4 mt-6">
        
        {/* Grayscale Avatar with solid red offset brutalist back shadow */}
        <div className="relative w-32 h-32 md:w-36 md:h-36 mb-4 group select-none">
          {/* Brutalist offset crimson panel */}
          <div className="absolute inset-0 bg-accent-red translate-x-2.5 translate-y-2.5 rounded-none z-0"></div>
          
          <img 
            alt="Marcus Court Hooper Profile" 
            className="relative w-full h-full object-cover rounded-none grayscale group-hover:grayscale-0 transition-all duration-300 border-4 border-action-dark z-10 select-none" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-uarHCOt3FFuqMpdt-FZASVK90YuwpqHxYFcrnmQTreUfHSQWbuapleZSKNiWgCRe5ajh3nFXxC1NGVbJUT4KRk6OD6voZuziQWciSilY6PcwAoXLj22goCorRssok4KtpGNktXXL8X13LUDaJIg5ZmyEteM2sTRLwdB8CoynGUPEY35Tqs_K8WGS2nxum1z7Sv-pxF4NrcPECs94Fk0W9A6oPn3M6clynd7idQly2ds9jRP4Vj6Sm5vY1kDa3X9QaDXUY90dagA"
          />

          <button 
            type="button"
            onClick={() => {
              const newName = prompt("Edit Pilot Call Sign:", username);
              if (newName && newName.trim() !== "") {
                setUsername(newName.trim());
              }
            }}
            className="absolute bottom-[-6px] right-[-6px] z-20 bg-action-dark hover:bg-accent-red text-white w-10.2 h-10.2 flex items-center justify-center rounded-full cursor-pointer transition-colors border-2 border-white shadow-md hover:scale-105 duration-200"
            title="Edit Username"
          >
            <Edit2 className="w-4 h-4 text-white stroke-[2.5]" />
          </button>
        </div>

        {/* Username displaying fields */}
        {editingName ? (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-display text-2xl uppercase tracking-tighter text-action-dark border-2 border-action-dark p-1.5 outline-none font-bold placeholder:text-text-muted/40"
            />
            <button 
              onClick={() => setEditingName(false)}
              className="bg-action-dark text-white p-2 border-2 border-action-dark font-display text-xs cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setEditingName(true)}>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-action-dark uppercase tracking-tighter hover:text-accent-red transition-colors">
              {username}
            </h2>
            <Edit2 className="w-4.5 h-4.5 text-text-muted/50 group-hover:text-accent-red opacity-0 group-hover:opacity-100 transition-all stroke-[2.5]" />
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-red text-white font-display text-[10px] font-bold uppercase tracking-[0.25em] mb-2 rounded-sm select-none">
          <Flame className="w-3.5 h-3.5" />
          ELITE HOOPER LEVEL
        </div>
      </section>

      {/* Twin Dynamic stats metrics cards */}
      <section className="grid grid-cols-2 gap-4 w-full">
        
        {/* Stat Card 1 - Calories */}
        <div className="bg-white p-6 border-2 border-action-dark rounded-none flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-accent-red transition-all cursor-pointer">
          <span className="material-symbols-outlined text-accent-red text-3xl mb-2 z-10 transition-transform duration-300 group-hover:scale-110">
            <Flame className="w-8 h-8 text-accent-red stroke-[2.5]" />
          </span>
          <span className="font-display text-2xl md:text-3xl font-black text-action-dark z-10 leading-none">
            12,450
          </span>
          <span className="font-display text-[10px] font-extrabold text-text-muted mt-1 uppercase tracking-widest z-10">
            CALORIES BURNED
          </span>

          {/* Absolutes decorative background icon */}
          <div className="absolute -right-4 -top-4 opacity-[0.035] group-hover:opacity-[0.07] transition-opacity z-0 pointer-events-none text-action-dark">
            <Flame className="w-28 h-28" />
          </div>
        </div>

        {/* Stat Card 2 - Play Time */}
        <div className="bg-white p-6 border-2 border-action-dark rounded-none flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-accent-red transition-all cursor-pointer">
          <span className="material-symbols-outlined text-action-dark text-3xl mb-2 z-10 transition-transform duration-300 group-hover:scale-110">
            <Timer className="w-8 h-8 text-action-dark stroke-[2.5]" />
          </span>
          <span className="font-display text-2xl md:text-3xl font-black text-action-dark z-10 leading-none">
            142 HRS
          </span>
          <span className="font-display text-[10px] font-extrabold text-text-muted mt-1 uppercase tracking-widest z-10">
            TOTAL PLAY TIME
          </span>

          {/* Absolutes decorative background icon */}
          <div className="absolute -right-4 -top-4 opacity-[0.035] group-hover:opacity-[0.07] transition-opacity z-0 pointer-events-none text-action-dark">
            <Timer className="w-28 h-28" />
          </div>
        </div>

      </section>

      {/* Accordion List Options */}
      <section className="flex flex-col gap-4 mt-2">
        
        {/* Accordion Row 1: Order History */}
        <div className="bg-white border-2 border-action-dark shadow-sm">
          <button 
            type="button"
            onClick={() => toggleAccordion(0)}
            className="w-full flex justify-between items-center p-5 cursor-pointer hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <Receipt className="w-5 h-5 text-action-dark stroke-[2.5]" />
              <span className="font-display text-xs md:text-sm font-bold text-action-dark uppercase tracking-widest">
                Order History
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion ===  0 ? 'rotate-180 text-accent-red' : ''}`} />
          </button>
          
          <AnimatePresence initial={false}>
            {activeAccordion === 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-action-dark/10"
              >
                <div className="p-5 font-sans text-xs md:text-sm text-text-muted leading-relaxed">
                  No recent orders found on the grid ledger. Time to lock some limit drops.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Row 2: Payment Methods */}
        <div className="bg-white border-2 border-action-dark shadow-sm">
          <button 
            type="button"
            onClick={() => toggleAccordion(1)}
            className="w-full flex justify-between items-center p-5 cursor-pointer hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <CreditCard className="w-5 h-5 text-action-dark stroke-[2.5]" />
              <span className="font-display text-xs md:text-sm font-bold text-action-dark uppercase tracking-widest">
                Payment Methods
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion ===  1 ? 'rotate-180 text-accent-red' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 1 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-action-dark/10 bg-brand-bg/25"
              >
                <div className="p-5 font-sans text-xs md:text-sm text-text-muted flex items-center justify-between">
                  <span>Visa ending in 4242 (CORES DEFAULT CREDIT)</span>
                  <button 
                    onClick={() => alert("Card modifications restricted on practice ledger.")}
                    className="font-display text-xs font-bold text-accent-red uppercase hover:underline cursor-pointer"
                  >
                    Edit Card
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Row 3: Shipping Address */}
        <div className="bg-white border-2 border-action-dark shadow-sm">
          <button 
            type="button"
            onClick={() => toggleAccordion(2)}
            className="w-full flex justify-between items-center p-5 cursor-pointer hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <MapPin className="w-5 h-5 text-action-dark stroke-[2.5]" />
              <span className="font-display text-xs md:text-sm font-bold text-action-dark uppercase tracking-widest">
                Shipping Address
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion ===  2 ? 'rotate-180 text-accent-red' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 2 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-action-dark/10"
              >
                <div className="p-5 font-sans text-xs md:text-sm text-text-main leading-relaxed flex flex-col gap-1">
                  <span className="font-bold text-accent-red tracking-wide uppercase font-display text-xs">DEFAULT ADRESS FOR LOCKOUT DEPOSITS:</span>
                  <span className="text-text-muted font-semibold mt-1">Marcus Court</span>
                  <span className="text-text-muted font-medium">123 Asphalt Ave, Hoop City, NY 10001</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Row 4: Settings (Red Border Accent) */}
        <div className="bg-white border-2 border-action-dark border-l-4 border-l-accent-red shadow-sm">
          <button 
            type="button"
            onClick={() => toggleAccordion(3)}
            className="w-full flex justify-between items-center p-5 cursor-pointer hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <Settings className="w-5 h-5 text-accent-red stroke-[2.5]" />
              <span className="font-display text-xs md:text-sm font-bold text-action-dark uppercase tracking-widest">
                Settings / Access Security
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion ===  3 ? 'rotate-180 text-accent-red' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 3 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-action-dark/10 bg-brand-bg/15"
              >
                <div className="p-5 flex flex-col gap-3.5 text-xs md:text-sm font-medium">
                  <button 
                    onClick={() => alert("Asphalt sensory tracking: Activated.")} 
                    className="text-left font-sans text-action-dark hover:text-accent-red transition-all cursor-pointer font-semibold uppercase tracking-wider"
                  >
                    Sensor Calibration
                  </button>
                  <button 
                    onClick={() => alert("Account is secured under global private key.")} 
                    className="text-left font-sans text-action-dark hover:text-accent-red transition-all cursor-pointer font-semibold uppercase tracking-wider"
                  >
                    Private Key Security Credentials
                  </button>
                  
                  <div className="border-t border-action-dark/10 pt-3.5 mt-2.5">
                    <button 
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 text-left font-display font-bold text-accent-red hover:underline tracking-widest uppercase cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 stroke-[2.5]" />
                      LOG OUT SECURELY CODE
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>

    </div>
  );
};
