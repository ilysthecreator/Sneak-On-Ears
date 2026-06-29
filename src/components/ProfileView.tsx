import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Timer, Receipt, CreditCard, MapPin, Settings, ChevronDown, LogOut, Check, ShieldAlert } from 'lucide-react';
import { api } from '../api';
import { User, formatIDR } from '../types';

interface ProfileViewProps {
  user: User | null;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [playTimeHours, setPlayTimeHours] = useState(0);
  const [shippingName, setShippingName] = useState('');
  const [shippingDetail, setShippingDetail] = useState('');
  const [paymentVisa, setPaymentVisa] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  // Customize profile toggle & form fields
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editShippingName, setEditShippingName] = useState('');
  const [editShippingDetail, setEditShippingDetail] = useState('');
  const [editPaymentVisa, setEditPaymentVisa] = useState('');
  const [editCaloriesBurned, setEditCaloriesBurned] = useState(0);
  const [editPlayTimeHours, setEditPlayTimeHours] = useState(0);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch user profile data on load
  useEffect(() => {
    if (user) {
      setLoading(true);
      api.getProfile(user.id)
        .then((profile) => {
          setUsername(profile.username);
          setUserRole(profile.role || 'customer');
          setCaloriesBurned(profile.calories_burned);
          setPlayTimeHours(profile.play_time_hours);
          setShippingName(profile.shipping_address_name);
          setShippingDetail(profile.shipping_address_detail);
          setPaymentVisa(profile.payment_method_visa);

          // Populate edit fields
          setEditUsername(profile.username);
          setEditShippingName(profile.shipping_address_name);
          setEditShippingDetail(profile.shipping_address_detail);
          setEditPaymentVisa(profile.payment_method_visa);
          setEditCaloriesBurned(profile.calories_burned);
          setEditPlayTimeHours(profile.play_time_hours);

          return api.getUserOrders(user.id);
        })
        .then((ordersData) => {
          setOrders(ordersData);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading profile or orders:', err);
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      await api.updateProfile({
        userId: user.id,
        username: editUsername.trim(),
        shipping_address_name: editShippingName.trim(),
        shipping_address_detail: editShippingDetail.trim(),
        payment_method_visa: editPaymentVisa.trim(),
        calories_burned: userRole === 'customer' ? editCaloriesBurned : undefined,
        play_time_hours: userRole === 'customer' ? editPlayTimeHours : undefined,
      });

      // Update local displays
      setUsername(editUsername.trim());
      setShippingName(editShippingName.trim());
      setShippingDetail(editShippingDetail.trim());
      setPaymentVisa(editPaymentVisa.trim());
      if (userRole === 'customer') {
        setCaloriesBurned(editCaloriesBurned);
        setPlayTimeHours(editPlayTimeHours);
      }

      // Update local storage user name too
      const localUser = localStorage.getItem('sneak_user');
      if (localUser) {
        const parsed = JSON.parse(localUser);
        parsed.username = editUsername.trim();
        localStorage.setItem('sneak_user', JSON.stringify(parsed));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-display text-lg font-bold uppercase tracking-widest text-action-dark select-none">
        <div className="animate-pulse">LOADING PROFILE LEDGER...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pb-16 relative font-sans text-left">
      
      {/* Success Notification Alert */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-action-dark text-white border-4 border-green-500 font-display text-sm uppercase py-4 px-8 tracking-widest z-50 flex items-center gap-3 shadow-2xl"
          >
            <Check className="w-5 h-5 text-green-500 stroke-[2.5]" />
            <span>Profile Data Saved Securely!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header Block */}
      <section className="flex flex-col items-center justify-center text-center gap-4 mt-6">
        
        {/* Grayscale Avatar with solid red offset brutalist back shadow */}
        <div className="relative w-32 h-32 md:w-36 md:h-36 mb-4 group select-none">
          <div className="absolute inset-0 bg-accent-red translate-x-2.5 translate-y-2.5 rounded-none z-0"></div>
          
          <img 
            alt="User Profile" 
            className="relative w-full h-full object-cover rounded-none grayscale group-hover:grayscale-0 transition-all duration-300 border-4 border-action-dark z-10 select-none" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-uarHCOt3FFuqMpdt-FZASVK90YuwpqHxYFcrnmQTreUfHSQWbuapleZSKNiWgCRe5ajh3nFXxC1NGVbJUT4KRk6OD6voZuziQWciSilY6PcwAoXLj22goCorRssok4KtpGNktXXL8X13LUDaJIg5ZmyEteM2sTRLwdB8CoynGUPEY35Tqs_K8WGS2nxum1z7Sv-pxF4NrcPECs94Fk0W9A6oPn3M6clynd7idQly2ds9jRP4Vj6Sm5vY1kDa3X9QaDXUY90dagA"
          />
        </div>

        {/* Username display details */}
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-action-dark uppercase tracking-tighter">
            {username}
          </h2>
          <span className="font-sans text-[11px] text-text-muted font-bold tracking-widest uppercase opacity-75">
            {user?.email}
          </span>
        </div>

        {/* Dynamic Badge indicator based on role */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-red text-white font-display text-[10px] font-bold uppercase tracking-[0.25em] mb-2 rounded-sm select-none">
          {userRole === 'admin' ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>COMMAND CHIEF LEVEL</span>
            </>
          ) : (
            <>
              <Flame className="w-3.5 h-3.5" />
              <span>ELITE HOOPER LEVEL</span>
            </>
          )}
        </div>
      </section>

      {/* Customize Form vs Details toggler */}
      {isEditing ? (
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-action-dark p-6 md:p-8 shadow-[6px_6px_0px_#000] flex flex-col gap-5 text-left"
        >
          <div className="border-b-2 border-action-dark pb-2">
            <h3 className="font-display text-xs font-black text-action-dark uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-4.5 h-4.5 text-accent-red" />
              Customize Pilot Profile
            </h3>
          </div>

          <form onSubmit={handleSaveChanges} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Username (Call Sign) *</label>
                <input 
                  type="text" required value={editUsername} onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Payment Method (Card) *</label>
                <input 
                  type="text" required value={editPaymentVisa} onChange={(e) => setEditPaymentVisa(e.target.value)}
                  className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Shipping Recipient Name *</label>
                <input 
                  type="text" required value={editShippingName} onChange={(e) => setEditShippingName(e.target.value)}
                  className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Shipping Delivery Address *</label>
                <input 
                  type="text" required value={editShippingDetail} onChange={(e) => setEditShippingDetail(e.target.value)}
                  className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                />
              </div>
            </div>

            {userRole === 'customer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-dashed border-action-dark/15 pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Hoop Calories Burned</label>
                  <input 
                    type="number" min="0" value={editCaloriesBurned} onChange={(e) => setEditCaloriesBurned(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Hoop Play Time Hours</label>
                  <input 
                    type="number" min="0" value={editPlayTimeHours} onChange={(e) => setEditPlayTimeHours(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-2">
              <button
                type="submit" disabled={saving}
                className="flex-1 bg-action-dark hover:bg-accent-red text-white font-display text-xs font-bold uppercase tracking-widest py-3.5 border-0 rounded-none shadow-md cursor-pointer disabled:bg-text-muted transition-colors"
              >
                {saving ? 'SAVING DATA...' : 'SAVE CHANGES'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditUsername(username);
                  setEditShippingName(shippingName);
                  setEditShippingDetail(shippingDetail);
                  setEditPaymentVisa(paymentVisa);
                  if (userRole === 'customer') {
                    setEditCaloriesBurned(caloriesBurned);
                    setEditPlayTimeHours(playTimeHours);
                  }
                }}
                className="px-6 bg-brand-bg hover:bg-surface-container text-action-dark font-display text-xs font-bold uppercase tracking-widest border-2 border-action-dark rounded-none cursor-pointer transition-all"
              >
                CANCEL
              </button>
            </div>
          </form>
        </motion.section>
      ) : (
        <>
          {/* Twin Stats cards (Customer role only) */}
          {userRole === 'customer' && (
            <section className="grid grid-cols-2 gap-4 w-full">
              {/* Stat Card 1 - Calories */}
              <div className="bg-white p-6 border-2 border-action-dark rounded-none flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-accent-red transition-all">
                <span className="text-accent-red text-3xl mb-2 z-10 transition-transform duration-300 group-hover:scale-110">
                  <Flame className="w-8 h-8 text-accent-red stroke-[2.5]" />
                </span>
                <span className="font-display text-2xl md:text-3xl font-black text-action-dark z-10 leading-none">
                  {caloriesBurned.toLocaleString()}
                </span>
                <span className="font-display text-[10px] font-extrabold text-text-muted mt-1 uppercase tracking-widest z-10">
                  CALORIES BURNED
                </span>

                <div className="absolute -right-4 -top-4 opacity-[0.035] group-hover:opacity-[0.07] transition-opacity z-0 pointer-events-none text-action-dark">
                  <Flame className="w-28 h-28" />
                </div>
              </div>

              {/* Stat Card 2 - Play Time */}
              <div className="bg-white p-6 border-2 border-action-dark rounded-none flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-accent-red transition-all">
                <span className="text-action-dark text-3xl mb-2 z-10 transition-transform duration-300 group-hover:scale-110">
                  <Timer className="w-8 h-8 text-action-dark stroke-[2.5]" />
                </span>
                <span className="font-display text-2xl md:text-3xl font-black text-action-dark z-10 leading-none">
                  {playTimeHours} HRS
                </span>
                <span className="font-display text-[10px] font-extrabold text-text-muted mt-1 uppercase tracking-widest z-10">
                  TOTAL PLAY TIME
                </span>

                <div className="absolute -right-4 -top-4 opacity-[0.035] group-hover:opacity-[0.07] transition-opacity z-0 pointer-events-none text-action-dark">
                  <Timer className="w-28 h-28" />
                </div>
              </div>
            </section>
          )}

          {/* Customize Profile Toggle Button */}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full bg-white text-action-dark border-4 border-action-dark hover:bg-action-dark hover:text-white font-display text-xs font-black uppercase tracking-widest py-4 transition-all shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer rounded-none"
          >
            CUSTOMIZE PROFILE DETAILS
          </button>

          {/* Accordion List Options */}
          <section className="flex flex-col gap-4">
            
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
                <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion === 0 ? 'rotate-180 text-accent-red' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {activeAccordion === 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-action-dark/10"
                  >
                    <div className="p-5 flex flex-col gap-4 font-sans text-xs md:text-sm text-text-main">
                      {orders.length === 0 ? (
                        <div className="text-text-muted leading-relaxed">
                          No recent orders found on the grid ledger. Time to lock some limit drops.
                        </div>
                      ) : (
                         orders.map((order) => (
                           <div key={order.id} className="border-2 border-action-dark p-4 bg-brand-bg/10 flex flex-col gap-3 shadow-sm text-left">
                             <div className="flex justify-between items-center border-b border-action-dark/15 pb-2">
                               <div className="flex flex-col">
                                 <span className="font-display font-black text-action-dark">ORDER ID: {order.id}</span>
                                 <span className="text-[10px] text-text-muted font-bold mt-0.5">{new Date(order.created_at).toLocaleString()}</span>
                               </div>
                               <span className={`text-[10px] font-black uppercase py-1 px-3 tracking-wider ${
                                 order.status === 'paid' 
                                   ? 'bg-green-600 text-white' 
                                   : order.status === 'shipped'
                                   ? 'bg-blue-600 text-white'
                                   : order.status === 'completed'
                                   ? 'bg-action-dark text-white'
                                   : 'bg-accent-red text-white'
                               }`}>
                                 {order.status}
                               </span>
                             </div>

                             {/* Order Items */}
                             <div className="flex flex-col gap-2">
                               {order.items && order.items.map((item: any) => (
                                 <div key={item.id} className="flex gap-3 items-center justify-between">
                                   <div className="flex gap-2 items-center">
                                     <div className="w-10 h-10 bg-white border border-action-dark/10 p-1 flex items-center justify-center shrink-0">
                                       <img src={item.image || '/src/assets/giannis-immortality-white.png'} alt={item.sneaker_name} className="w-full h-full object-contain" />
                                     </div>
                                     <div className="flex flex-col text-left">
                                       <span className="font-bold text-action-dark uppercase text-[11px] max-w-[200px] truncate">{item.sneaker_name}</span>
                                       <span className="text-[9px] text-text-muted font-semibold">SIZE: {item.size} • QTY: {item.quantity}</span>
                                     </div>
                                   </div>
                                   <span className="font-display font-bold text-action-dark">{formatIDR(item.price * item.quantity)}</span>
                                 </div>
                               ))}
                             </div>

                             <div className="flex justify-between items-end border-t border-action-dark/10 pt-2 mt-1">
                               <div className="flex flex-col text-[10px] text-text-muted font-semibold">
                                 <span>SHIPPED TO:</span>
                                 <span className="uppercase text-[9px] mt-0.5 font-bold text-action-dark">{order.shipping_name} • {order.shipping_detail}</span>
                               </div>
                               <div className="flex flex-col items-end">
                                 <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">TOTAL PAID</span>
                                 <span className="font-display text-base font-black text-accent-red leading-none mt-0.5">{formatIDR(order.total_amount)}</span>
                               </div>
                             </div>
                           </div>
                         ))
                       )}
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
                <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion === 1 ? 'rotate-180 text-accent-red' : ''}`} />
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
                      <span>{paymentVisa || 'No payment card set.'} (CORES DEFAULT CREDIT)</span>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="font-display text-xs font-bold text-accent-red uppercase hover:underline cursor-pointer border-0 bg-transparent"
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
                <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion === 2 ? 'rotate-180 text-accent-red' : ''}`} />
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
                      <div className="flex justify-between items-center w-full mb-2">
                        <span className="font-bold text-accent-red tracking-wide uppercase font-display text-xs">DEFAULT ADDRESS FOR LOCKOUT DEPOSITS:</span>
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="font-display text-xs font-bold text-accent-red uppercase hover:underline cursor-pointer border-0 bg-transparent"
                        >
                          Edit Address
                        </button>
                      </div>
                      <span className="text-text-muted font-semibold mt-1">{shippingName}</span>
                      <span className="text-text-muted font-medium">{shippingDetail}</span>
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
                <ChevronDown className={`w-5 h-5 text-action-dark transition-transform duration-300 ${activeAccordion === 3 ? 'rotate-180 text-accent-red' : ''}`} />
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
                        type="button"
                        onClick={() => alert("Asphalt sensory tracking: Activated.")} 
                        className="text-left font-sans text-action-dark hover:text-accent-red transition-all cursor-pointer font-semibold uppercase tracking-wider bg-transparent border-0"
                      >
                        Sensor Calibration
                      </button>
                      <button 
                        type="button"
                        onClick={() => alert("Account is secured under global private key.")} 
                        className="text-left font-sans text-action-dark hover:text-accent-red transition-all cursor-pointer font-semibold uppercase tracking-wider bg-transparent border-0"
                      >
                        Private Key Security Credentials
                      </button>
                      
                      <div className="border-t border-action-dark/10 pt-3.5 mt-2.5">
                        <button 
                          type="button"
                          onClick={onLogout}
                          className="inline-flex items-center gap-2 text-left font-display font-bold text-accent-red hover:underline tracking-widest uppercase cursor-pointer bg-transparent border-0"
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
        </>
      )}

    </div>
  );
};
