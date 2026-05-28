import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface LoginViewProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('baller@court.com');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Simulate validation
    setTimeout(() => {
      setLoading(false);
      setLoggedIn(true);
      navigate('/shop');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full flex flex-col md:flex-row bg-brand-bg relative z-10 font-sans selection:bg-accent-red selection:text-white">
      
      {/* Left Column - Hero Split Area */}
      <div className="relative w-full h-80 md:h-auto md:w-1/2 overflow-hidden bg-surface-container border-b-2 md:border-b-0 md:border-r-2 border-action-dark">
        {/* Sleek skewed geometric red stripe backdrop */}
        <div className="absolute inset-0 bg-accent-red transform -skew-x-12 translate-x-1/4 scale-150 origin-bottom-right z-0"></div>
        
        {/* Floating sneaker product photo */}
        <motion.img 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover object-center z-10 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 pointer-events-none"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHfK1uTrOufULTMTG4rxkNgvVG83sx_df3xNqRcwe6RstHO-vo_exLI_ivp6QNqacC4kyeYDXB0F46j9ibH2k8elA9v4Uac85MT0nzspyiZRKhjQmwbx_XX4jm8j76WUkypYSV8G_3ygPMjpsKIQ2OnKU1Qg2R0D2wnb_BcQnWjn8YBTSlC_DC_BoEWWrWqZEnRuasWxFH02s00EGh4TY9zlLxeSGJr_moiY3qhRjTnHZ-V-QlHkm-MmMUseXOeJ9kab1GLAmvIhw"
          alt="Performance Sneaker Red Core"
        />

        {/* Mobile Header Overlay */}
        <div className="absolute top-6 left-6 z-20 md:hidden bg-action-dark/80 backdrop-blur-sm p-3.5 border-l-2 border-accent-red">
          <h1 className="font-display text-2xl font-black italic tracking-tighter text-white uppercase">
            SNEAK ON EARS
          </h1>
        </div>
      </div>

      {/* Right Column - Input Form Area */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 py-12 bg-brand-bg relative z-10">
        <div className="w-full max-w-md flex flex-col gap-8">
          
          {/* Top Bar for Form (Go Back option) */}
          <button 
            onClick={() => navigate('/shop')}
            className="self-start inline-flex items-center gap-2 text-xs font-display font-bold uppercase text-text-muted hover:text-accent-red transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            Return to shop
          </button>

          {/* Desktop Logo heading */}
          <div className="hidden md:block">
            <h1 className="font-display text-3xl font-black italic uppercase tracking-tighter text-action-dark">
              SNEAK ON EARS
            </h1>
          </div>

          {/* Core titles */}
          <div>
            <h2 className="font-display text-6xl md:text-[80px] md:leading-[0.9] font-black text-action-dark uppercase tracking-tighter">
              LOGIN
            </h2>
            <p className="font-sans text-[13px] md:text-sm font-semibold text-text-muted mt-1 uppercase tracking-wider">
              ENTER THE COURT • ACCESS YOUR SAVED GEAR.
            </p>
          </div>

          {/* Form action interface */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            
            {/* Email Form Row */}
            <div className="flex flex-col gap-2 relative group">
              <label 
                className="font-display text-xs font-bold text-action-dark uppercase tracking-widest text-left"
                htmlFor="email-input"
              >
                Email Address
              </label>

              <div className="relative shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10 group-focus-within:text-action-dark transition-colors">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </span>
                <input 
                  id="email-input"
                  type="email"
                  required
                  placeholder="baller@court.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white text-text-main font-sans text-sm outline-none border-2 border-transparent focus:border-action-dark transition-all rounded-sm placeholder:text-text-muted/50"
                />
              </div>
            </div>

            {/* Password Form Row */}
            <div className="flex flex-col gap-2 relative group">
              <div className="flex justify-between items-center w-full">
                <label 
                  className="font-display text-xs font-bold text-action-dark uppercase tracking-widest text-left"
                  htmlFor="password-input"
                >
                  Password
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => e.preventDefault()}
                  className="text-text-muted hover:text-accent-red font-sans text-xs tracking-tight hover:underline underline-offset-2"
                >
                  Forgot?
                </a>
              </div>

              <div className="relative shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10 group-focus-within:text-action-dark transition-colors">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                </span>
                <input 
                  id="password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white text-text-main font-sans text-sm outline-none border-2 border-transparent focus:border-action-dark transition-all rounded-sm placeholder:text-text-muted/50"
                />
              </div>
            </div>

            {/* Login CTA trigger */}
            <div className="pt-2">
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-action-dark text-white font-display text-lg font-bold uppercase tracking-widest hover:bg-accent-red hover:tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-text-muted disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-pulse tracking-widest">ENTERING COURT...</span>
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Social Sign-up panel fallback */}
          <div className="text-center mt-3">
            <p className="font-sans text-xs md:text-sm text-text-muted">
              NEW ROOKIE?{' '}
              <a 
                href="#signup" 
                onClick={(e) => e.preventDefault()}
                className="text-action-dark font-display font-bold uppercase tracking-wider hover:text-accent-red underline underline-offset-4 decoration-2"
              >
                SIGN UP
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
