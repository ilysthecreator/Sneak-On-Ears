import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';
import { api } from '../api';
import { CartItem, User, formatIDR } from '../types';

interface CartViewProps {
  cart: CartItem[];
  updateQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  user: User | null;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  user
}) => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Midtrans Mock Modal states
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockPaymentOption, setMockPaymentOption] = useState('card');
  const [mockOrderId, setMockOrderId] = useState('');

  // Dynamically load the Midtrans snap.js script on mount
  useEffect(() => {
    const scriptId = 'midtrans-snap-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      
      const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder';
      script.setAttribute('data-client-key', clientKey);
      document.body.appendChild(script);
    }
  }, []);

  // Math equations
  const subtotal = cart.reduce((total, item) => total + (item.sneaker.price * item.quantity), 0);
  const shippingCost = subtotal > 300 || subtotal === 0 ? 0 : 15;
  const totalAmount = subtotal + shippingCost;

  const handleCheckoutSubmit = async () => {
    if (cart.length === 0) return;
    if (!user) {
      alert("Please log in to checkout your order.");
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);

    try {
      const checkoutRes = await api.createPaymentToken(user.id, totalAmount);
      
      if (checkoutRes.isMock) {
        setMockOrderId(checkoutRes.orderId);
        setShowMockModal(true);
        setIsCheckingOut(false);
      } else {
        // Trigger real Midtrans Snap payment popup
        if ((window as any).snap) {
          (window as any).snap.pay(checkoutRes.token, {
            onSuccess: async (result: any) => {
              console.log('Midtrans Snap payment success:', result);
              try {
                await api.confirmPaymentSuccess(checkoutRes.orderId, user.id);
                setCheckoutComplete(true);
              } catch (confirmErr) {
                console.error('Error confirming payment:', confirmErr);
                alert('Order was paid but failed to sync history. Please contact support.');
              }
              setIsCheckingOut(false);
            },
            onPending: (result: any) => {
              console.log('Midtrans Snap payment pending:', result);
              alert('Payment is pending. Please complete transaction in your app.');
              setIsCheckingOut(false);
            },
            onError: (result: any) => {
              console.error('Midtrans Snap payment error:', result);
              alert('Payment failed. Please try again.');
              setIsCheckingOut(false);
            },
            onClose: () => {
              console.log('Midtrans Snap payment popup closed');
              setIsCheckingOut(false);
            }
          });
        } else {
          alert('Midtrans billing gateway is still loading. Please try again.');
          setIsCheckingOut(false);
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Error occurred while creating payment token.');
      setIsCheckingOut(false);
    }
  };

  const closeSuccessOverlay = () => {
    setCheckoutComplete(false);
    clearCart();
    navigate('/shop');
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-16 relative">
      
      {/* Visual checkout success alert modal */}
      <AnimatePresence>
        {checkoutComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-action-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none text-action-dark"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-action-dark p-8 md:p-12 text-center max-w-md w-full relative"
              id="checkout-success"
            >
              {/* Graphic stripe back-blocks */}
              <div className="w-16 h-16 bg-accent-red text-white flex items-center justify-center mx-auto rounded-full text-2xl font-black mb-6 animate-pulse">
                ✓
              </div>

              <h3 className="font-display text-4xl font-black uppercase text-action-dark tracking-tighter leading-none mb-3">
                ORDER SECURED!
              </h3>
              <p className="font-sans text-xs md:text-sm text-text-muted uppercase tracking-wider font-semibold leading-relaxed">
                WE HAVE LOCKED YOUR GEAR UNDER ACCESS GRIDS. EXPECT PACKAGING SCAN STATS IN 24 HOURS.
              </p>

              <div className="bg-brand-bg/60 border border-action-dark/15 p-4 my-6 text-left font-display">
                <span className="text-[10px] text-text-muted font-bold uppercase block tracking-wider">SECURE SHIPPED TO:</span>
                <span className="text-xs text-action-dark font-extrabold block mt-0.5 uppercase">123 ASPHALT AVE • HOOP CITY • NY</span>
              </div>

              <button
                onClick={closeSuccessOverlay}
                className="w-full bg-action-dark hover:bg-accent-red text-white font-display text-sm font-bold uppercase tracking-widest py-4 rounded-none cursor-pointer duration-300"
              >
                RETURN TO THE COURT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock Payment Simulation Modal */}
      <AnimatePresence>
        {showMockModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-action-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none text-action-dark"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-action-dark p-6 md:p-8 max-w-md w-full relative shadow-[8px_8px_0px_#000]"
            >
              {/* Header */}
              <div className="border-b-2 border-action-dark pb-2 mb-4 text-left">
                <h3 className="font-display text-xl font-black uppercase text-action-dark tracking-tighter">
                  MIDTRANS SANDBOX // MOCK PAY
                </h3>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest block mt-0.5">
                  Order ID: {mockOrderId} • Amount: {formatIDR(totalAmount)}
                </span>
              </div>

              {/* Payment Methods Options */}
              <div className="flex flex-col gap-3 text-left">
                <p className="font-sans text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  SELECT SIMULATED SANDBOX OPTION:
                </p>

                {/* Option 1: Card */}
                <button
                  type="button"
                  onClick={() => setMockPaymentOption('card')}
                  className={`w-full p-4 border-2 border-action-dark flex justify-between items-center cursor-pointer transition-all ${
                    mockPaymentOption === 'card' 
                      ? 'bg-action-dark text-white shadow-sm' 
                      : 'bg-brand-bg text-action-dark hover:bg-surface-container'
                  }`}
                >
                  <span className="font-display text-xs font-bold uppercase tracking-widest">MOCK CREDIT CARD</span>
                  <span className="text-[9px] font-bold py-0.5 px-2 bg-accent-red text-white uppercase">INSTANT</span>
                </button>

                {/* Option 2: Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setMockPaymentOption('bank')}
                  className={`w-full p-4 border-2 border-action-dark flex justify-between items-center cursor-pointer transition-all ${
                    mockPaymentOption === 'bank' 
                      ? 'bg-action-dark text-white shadow-sm' 
                      : 'bg-brand-bg text-action-dark hover:bg-surface-container'
                  }`}
                >
                  <span className="font-display text-xs font-bold uppercase tracking-widest">MOCK BANK TRANSFER (VA)</span>
                  <span className="text-[9px] font-bold py-0.5 px-2 bg-accent-red text-white uppercase">SIMULATED</span>
                </button>

                {/* Option 3: QRIS */}
                <button
                  type="button"
                  onClick={() => setMockPaymentOption('qris')}
                  className={`w-full p-4 border-2 border-action-dark flex justify-between items-center cursor-pointer transition-all ${
                    mockPaymentOption === 'qris' 
                      ? 'bg-action-dark text-white shadow-sm' 
                      : 'bg-brand-bg text-action-dark hover:bg-surface-container'
                  }`}
                >
                  <span className="font-display text-xs font-bold uppercase tracking-widest">MOCK QRIS PAY</span>
                  <span className="text-[9px] font-bold py-0.5 px-2 bg-accent-red text-white uppercase">QR CODE</span>
                </button>
              </div>

              {/* QR Code display if QRIS is selected */}
              {mockPaymentOption === 'qris' && (
                <div className="my-5 p-3 bg-brand-bg border-2 border-dashed border-action-dark/30 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 bg-action-dark flex items-center justify-center text-white font-display text-xs font-bold uppercase p-2 select-none">
                    [ MOCK QRIS ]
                  </div>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-2">
                    Scan with simulated payment apps
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.confirmPaymentSuccess(mockOrderId, user.id);
                      setShowMockModal(false);
                      setCheckoutComplete(true);
                    } catch (confirmErr) {
                      console.error('Error confirming payment:', confirmErr);
                      alert('Simulated payment confirmation failed.');
                    }
                  }}
                  className="flex-1 bg-action-dark hover:bg-accent-red text-white font-display text-xs font-bold uppercase tracking-widest py-3.5 border-0 rounded-none shadow-md cursor-pointer transition-colors"
                >
                  PAY SIMULATED
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMockModal(false);
                  }}
                  className="px-6 bg-brand-bg hover:bg-surface-container text-action-dark font-display text-xs font-bold uppercase tracking-widest border-2 border-action-dark rounded-none cursor-pointer transition-all"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Title header block */}
      <div className="flex items-center gap-4 border-b-4 border-action-dark pb-3">
        <button 
          onClick={() => navigate('/shop')}
          className="p-1.5 hover:bg-surface-container rounded-none transition-colors -ml-1 text-action-dark cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-action-dark">
          MY CART // DETAILS
        </h2>
      </div>

      {subtotal > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8 mt-4 text-left">
          
          {/* Left aspect - Sequential items basket representation list */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {cart.map((item, index) => (
              <div 
                key={`${item.sneaker.id}-${item.size}-${index}`}
                className="bg-white border-2 border-action-dark p-4 flex gap-4 md:gap-6 relative shadow-sm hover:shadow-md transition-all rounded-none"
              >
                {/* Trash trigger absolute */}
                <button 
                  onClick={() => removeFromCart(index)}
                  className="absolute top-3 right-3 text-text-muted hover:text-accent-red cursor-pointer transition-colors p-1"
                  title="Remove Core Product"
                >
                  <Trash2 className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>

                {/* Left side: Soft-gray formatted sneaker wrapper */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-container rounded-none p-2 shrink-0 flex items-center justify-center border border-action-dark/5">
                  <img 
                    alt={item.sneaker.name} 
                    className="w-full h-full object-contain filter drop-shadow-md contrast-102" 
                    src={item.sneaker.image}
                  />
                </div>

                {/* Right side: item specifications details */}
                <div className="flex flex-col justify-between grow py-1">
                  <div>
                    <h3 className="font-display text-base md:text-lg font-extrabold uppercase pr-6 text-action-dark leading-tight">
                      {item.sneaker.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-sans text-xs text-text-muted font-semibold">
                      <span>SIZE: US {item.size}</span>
                      <span className="hidden md:inline text-action-dark/15">•</span>
                      <span>COLOR: {item.selectedColor}</span>
                    </div>
                  </div>

                  {/* Quantity and Price row */}
                  <div className="flex justify-between items-end mt-2">
                    
                    {/* Compact stepper layout controller */}
                    <div className="flex items-center border-2 border-action-dark bg-white rounded-none">
                      <button 
                        onClick={() => updateQuantity(index, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors text-action-dark cursor-pointer"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="w-8 text-center font-display text-xs font-black text-action-dark">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(index, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors text-action-dark cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* price details formatted in Oswald */}
                    <div className="font-display text-xl md:text-2xl font-black text-action-dark">
                      {formatIDR(item.sneaker.price * item.quantity)}
                    </div>

                  </div>
                </div>

              </div>
            ))}

            {/* Bottom buttons action controls */}
            <div className="flex justify-between items-center mt-2">
              <button 
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase text-action-dark hover:text-accent-red cursor-pointer p-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                CONTINUE DISCOVERY
              </button>
              
              <button 
                onClick={clearCart}
                className="font-display text-xs font-bold uppercase text-text-muted hover:text-accent-red cursor-pointer p-2 transition-all"
              >
                WIPE GRID (CLEAR)
              </button>
            </div>
          </div>

          {/* Right aspect - Sticky summary layout invoice card */}
          <div className="w-full lg:w-1/3 self-start lg:sticky lg:top-28">
            <div className="bg-action-dark text-white p-6 rounded-none shadow-xl border-2 border-action-dark flex flex-col">
              
              <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-5 border-b-2 border-white/10 pb-3 text-white">
                CART SUMMARY
              </h3>

              <div className="flex flex-col gap-3.5 font-sans text-xs md:text-sm mb-6 pb-2">
                <div className="flex justify-between">
                  <span className="text-brand-bg/60 font-semibold uppercase tracking-wider">Subtotal:</span>
                  <span className="font-display font-bold">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-bg/60 font-semibold uppercase tracking-wider">Secure Shipping:</span>
                  <span className="font-display font-bold">
                    {shippingCost === 0 ? 'FREE DELIVERY' : formatIDR(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-bg/60 font-semibold uppercase tracking-wider">Asphalt Duty Taxes:</span>
                  <span className="text-accent-red font-bold">INCLUDED</span>
                </div>
              </div>

              {/* Total Aggregate Dollar output block */}
              <div className="flex justify-between items-end border-t-2 border-white/15 pt-4 mb-6">
                <span className="font-display text-xs font-extrabold uppercase tracking-widest text-brand-bg/60 pb-1">
                  Payable Amount:
                </span>
                <span className="font-display text-2xl md:text-3xl font-extrabold text-white leading-none">
                  {formatIDR(totalAmount)}
                </span>
              </div>

              {/* Secure purchase submits */}
              <div className="flex flex-col gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckoutSubmit}
                  disabled={isCheckingOut}
                  className="w-full bg-white hover:bg-accent-red hover:text-white text-action-dark font-display text-sm md:text-base font-bold uppercase py-4 rounded-none cursor-pointer transition-colors duration-300 shadow-md flex items-center justify-center gap-2 disabled:bg-brand-bg/45 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {isCheckingOut ? 'LOCKING PAYMENT...' : (!user ? 'LOGIN TO CHECKOUT' : 'CHECKOUT ORDER')}
                  </span>
                </motion.button>
                
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-brand-bg/50 uppercase tracking-widest font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-red" />
                  3D-SECURED ASPHALT TRANSIT LOCK
                </div>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* Empty basket fallback representation */
        <div className="bg-white border-2 border-dashed border-action-dark/30 p-16 text-center max-w-xl mx-auto shadow-inner mt-4 w-full">
          <h3 className="font-display text-xl font-bold uppercase text-action-dark tracking-wide mb-1 text-center">
            YOUR GAME BAG IS EMPTY
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed text-center">
            You haven't locked any limited drops into your list yet. Hit the shop catalog to gear up for the asphalt sessions.
          </p>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/shop')}
              className="font-display text-xs font-bold text-white bg-action-dark py-3 px-8 hover:bg-accent-red transition-all cursor-pointer"
            >
              GO DISCOVER DROPS
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
