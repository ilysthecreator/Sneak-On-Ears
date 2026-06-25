import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { api } from '../api';

interface LoginViewProps {
  onLoginSuccess: (user: { id: number; email: string; username: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        if (!usernameInput.trim()) {
          setErrorMsg('Username is required for signup');
          setLoading(false);
          return;
        }
        const signupRes = await api.signup(cleanEmail, password, usernameInput.trim());
        onLoginSuccess(signupRes.user);
      } else {
        const loginRes = await api.login(cleanEmail, password);
        onLoginSuccess(loginRes.user);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || 'Error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center bg-brand-bg relative z-10 font-sans selection:bg-accent-red selection:text-white py-12 px-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Logo Header */}
        <div className="text-center flex flex-col items-center">
          <h1 className="font-display text-3xl font-black italic tracking-tighter text-action-dark uppercase leading-none">
            SNEAK ON EARS
          </h1>
          <span className="font-display text-[9px] font-bold text-accent-red uppercase tracking-[0.25em] mt-1.5">
            THE COURT LEDGER
          </span>
        </div>
          
          {/* Return button */}
          <button 
            onClick={() => navigate('/shop')}
            className="self-start inline-flex items-center gap-2 text-xs font-display font-bold uppercase text-text-muted hover:text-accent-red transition-colors py-1 cursor-pointer bg-transparent border-0 outline-none"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            Return to shop
          </button>

          {/* Brutalist Form Card */}
          <div className="bg-white border-4 border-action-dark p-6 md:p-8 shadow-[8px_8px_0px_#000000] text-left flex flex-col gap-6">
            
            {/* Header titles inside card */}
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-black text-action-dark uppercase tracking-tighter leading-none mb-1">
                {isSignUp ? 'SIGN UP' : 'LOGIN'}
              </h2>
              <p className="font-sans text-[11px] md:text-xs font-semibold text-text-muted uppercase tracking-wider">
                {isSignUp ? 'REGISTER AS A NEW ROOKIE' : 'ENTER THE COURT • ACCESS GEAR'}
              </p>
            </div>

            {/* Error Message rendering */}
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-accent-red text-accent-red p-3 text-xs font-bold uppercase tracking-widest leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full text-left">
              
              {/* Username Field (Only for Signup) */}
              {isSignUp && (
                <div className="flex flex-col gap-1.5 relative group">
                  <label 
                    className="font-display text-xs font-bold text-action-dark uppercase tracking-widest"
                    htmlFor="username-input"
                  >
                    Username / Call Sign
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 z-10 group-focus-within:text-action-dark transition-colors">
                      <User className="w-4.5 h-4.5 stroke-[2.5]" />
                    </span>
                    <input 
                      id="username-input"
                      type="text"
                      required
                      placeholder=""
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 bg-brand-bg text-text-main font-sans text-sm outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none placeholder:text-text-muted/40 font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Email Form Row */}
              <div className="flex flex-col gap-1.5 relative group">
                <label 
                  className="font-display text-xs font-bold text-action-dark uppercase tracking-widest"
                  htmlFor="email-input"
                >
                  Email Address
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 z-10 group-focus-within:text-action-dark transition-colors">
                    <Mail className="w-4.5 h-4.5 stroke-[2.5]" />
                  </span>
                  <input 
                    id="email-input"
                    type="email"
                    required
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-brand-bg text-text-main font-sans text-sm outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none placeholder:text-text-muted/40 font-semibold"
                  />
                </div>
              </div>

              {/* Password Form Row */}
              <div className="flex flex-col gap-1.5 relative group">
                <div className="flex justify-between items-center w-full">
                  <label 
                    className="font-display text-xs font-bold text-action-dark uppercase tracking-widest"
                    htmlFor="password-input"
                  >
                    Password
                  </label>
                  {!isSignUp && (
                    <a 
                      href="#forgot" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Default testing password is 'password123' (customer) or 'admin123' (admin).");
                      }}
                      className="text-text-muted hover:text-accent-red font-sans text-[11px] font-bold tracking-tight hover:underline underline-offset-2"
                    >
                      Forgot?
                    </a>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 z-10 group-focus-within:text-action-dark transition-colors">
                    <Lock className="w-4.5 h-4.5 stroke-[2.5]" />
                  </span>
                  <input 
                    id="password-input"
                    type="password"
                    required
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-brand-bg text-text-main font-sans text-sm outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none placeholder:text-text-muted/40 font-semibold"
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
                  className="w-full h-14 bg-action-dark text-white font-display text-base font-bold uppercase tracking-widest hover:bg-accent-red hover:tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-text-muted disabled:cursor-not-allowed border-0"
                >
                  {loading ? (
                    <span className="animate-pulse tracking-widest">{isSignUp ? 'CREATING...' : 'ENTERING COURT...'}</span>
                  ) : (
                    <>
                      <span>{isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}</span>
                      <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Toggle sign-up option */}
            <div className="text-center mt-2 border-t border-action-dark/10 pt-4">
              <p className="font-sans text-xs text-text-muted font-semibold">
                {isSignUp ? 'ALREADY A ROOKIE? ' : 'NEW ROOKIE? '}
                <a 
                  href="#toggle" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignUp(!isSignUp);
                    setErrorMsg('');
                  }}
                  className="text-action-dark font-display font-bold uppercase tracking-wider hover:text-accent-red underline underline-offset-4 decoration-2"
                >
                  {isSignUp ? 'LOGIN' : 'SIGN UP'}
                </a>
              </p>
            </div>

          </div>

      </div>

    </div>
  );
};
