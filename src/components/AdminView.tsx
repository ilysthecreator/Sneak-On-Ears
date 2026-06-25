import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Check, 
  PackagePlus, 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Trash2, 
  Plus, 
  X,
  Flame,
  Heart,
  BookOpen,
  Receipt
} from 'lucide-react';
import { api } from '../api';
import { User, Sneaker, Article, formatIDR } from '../types';

interface AdminViewProps {
  user: User | null;
  onSneakerAdded: () => void;
}

type TabType = 'overview' | 'catalog' | 'articles' | 'users' | 'transactions';

export const AdminView: React.FC<AdminViewProps> = ({ user, onSneakerAdded }) => {
  const navigate = useNavigate();

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-24 select-none font-sans font-medium max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 text-accent-red flex items-center justify-center rounded-full text-2xl font-bold mx-auto mb-4 border-2 border-accent-red">
          <ShieldAlert className="w-8 h-8 text-accent-red stroke-[2.5]" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-black text-action-dark uppercase tracking-tighter">
          ACCESS RESTRICTED
        </h2>
        <p className="text-text-muted text-xs md:text-sm mt-3 uppercase tracking-widest leading-relaxed">
          You must be logged in as an administrator to access the command deck.
        </p>
        <button 
          onClick={() => navigate('/shop')} 
          className="mt-8 bg-action-dark text-white py-4 px-10 hover:bg-accent-red transition-all cursor-pointer font-display text-xs font-bold uppercase tracking-widest border-0"
        >
          RETURN TO DOCKS
        </button>
      </div>
    );
  }

  // Navigation and data states
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [catalogList, setCatalogList] = useState<Sneaker[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [stats, setStats] = useState({
    sneakers: 0,
    users: 0,
    cartItems: 0,
    savedPairs: 0,
    articles: 0
  });

  const [loadingData, setLoadingData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);

  // Form states (Add Sneaker)
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [price, setPrice] = useState(1800000);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState('/src/assets/giannis-immortality-white.png');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([8, 9, 10, 11]);
  const [galleryInput, setGalleryInput] = useState('');

  // Form states (Add Article)
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleImage, setArticleImage] = useState('/src/assets/4.png');
  const [articleCategory, setArticleCategory] = useState('Culture');
  const [articleAuthor, setArticleAuthor] = useState('Sneak On Ears');

  const [loadingForm, setLoadingForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const allSizes = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
  const badgeOptions = ['', 'NEW', 'HOT', 'EXCLUSIVE', 'NEW DROP'];

  const fetchData = async () => {
    setLoadingData(true);
    
    try {
      const statsRes = await api.getAdminStats();
      setStats(statsRes);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }

    try {
      const sneakersRes = await api.getSneakers();
      setCatalogList(sneakersRes);
    } catch (err) {
      console.error('Error fetching sneakers:', err);
    }

    try {
      const usersRes = await api.getAdminUsers();
      setUsersList(usersRes);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }

    try {
      const articlesRes = await api.getArticles();
      setArticlesList(articlesRes);
    } catch (err) {
      console.error('Error fetching articles:', err);
    }

    try {
      const ordersRes = await api.getAdminOrders();
      setOrdersList(ordersRes);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }

    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedId = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setId(generatedId);
  };

  const handleSizeToggle = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const handleDeleteSneaker = async (sneakerId: string) => {
    if (!window.confirm(`Are you sure you want to delete sneaker ID: "${sneakerId}"? This will clear it from user carts and saved lists.`)) {
      return;
    }

    try {
      await api.deleteSneaker(sneakerId);
      setSuccessMsg('SNEAKER RECORD DELETED SUCCESSFULLY.');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      fetchData();
      onSneakerAdded();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error occurred while deleting sneaker.');
    }
  };

  const handleCreateSneaker = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!id.trim() || !name.trim() || !color.trim() || !image.trim() || !description.trim()) {
      setErrorMsg('Please fill in all required fields.');
      setLoadingForm(false);
      return;
    }

    if (selectedSizes.length === 0) {
      setErrorMsg('Please select at least one size.');
      setLoadingForm(false);
      return;
    }

    let gallery = [image.trim()];
    if (galleryInput.trim()) {
      const parsedGallery = galleryInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (parsedGallery.length > 0) {
        gallery = [image.trim(), ...parsedGallery];
      }
    }

    const sneakerData = {
      id: id.trim().toLowerCase(),
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      image: image.trim(),
      badge: badge ? badge.trim() : undefined,
      color: color.trim(),
      sizes: selectedSizes,
      gallery,
    };

    try {
      await api.createSneaker(sneakerData);
      setSuccessMsg('SNEAKER RECORD LOGGED SECURELY!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      onSneakerAdded();
      fetchData();
      setShowAddForm(false);
      
      setName('');
      setId('');
      setPrice(120);
      setDescription('');
      setBadge('');
      setColor('');
      setImage('/src/assets/giannis-immortality-white.png');
      setSelectedSizes([8, 9, 10, 11]);
      setGalleryInput('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while saving sneaker.');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    if (!window.confirm(`Are you sure you want to delete article ID: "${articleId}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteArticle(articleId);
      setSuccessMsg('ARTICLE RECORD DELETED SUCCESSFULLY.');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error occurred while deleting article.');
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!articleTitle.trim() || !articleContent.trim() || !articleImage.trim() || !articleCategory.trim() || !articleAuthor.trim()) {
      setErrorMsg('Please fill in all required fields.');
      setLoadingForm(false);
      return;
    }

    const articleData = {
      title: articleTitle.trim(),
      content: articleContent.trim(),
      image: articleImage.trim(),
      category: articleCategory.trim(),
      author: articleAuthor.trim(),
    };

    try {
      await api.createArticle(articleData);
      setSuccessMsg('ARTICLE PUBLISHED SECURELY!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      fetchData();
      setShowAddArticleForm(false);
      
      setArticleTitle('');
      setArticleContent('');
      setArticleImage('/src/assets/4.png');
      setArticleCategory('Culture');
      setArticleAuthor('Sneak On Ears');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while publishing article.');
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="w-full pb-16 font-sans text-left relative z-10 flex flex-col gap-6 select-none">
      
      {/* Toast Alert Success */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-action-dark text-white border-4 border-green-500 font-display text-sm uppercase py-4 px-8 tracking-widest z-50 flex items-center gap-3 shadow-2xl"
          >
            <Check className="w-5 h-5 text-green-500 stroke-[2.5]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Row */}
      <div className="flex justify-between items-center border-b-4 border-action-dark pb-4">
        <button 
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase text-action-dark hover:text-accent-red transition-all cursor-pointer p-1 bg-transparent border-0 outline-none"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          Return to Docks
        </button>
        <span className="font-display text-xs font-black text-accent-red uppercase tracking-[0.25em]">
          ADMIN LEVEL PORTAL // CONTROL PANEL
        </span>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 flex flex-col gap-3 bg-white border-4 border-action-dark p-6 shrink-0 shadow-[4px_4px_0px_#000] text-left justify-start self-start">
          <div className="border-b-2 border-action-dark pb-2 mb-3">
            <h3 className="font-display text-xs font-black text-action-dark uppercase tracking-widest">COMMAND CENTER</h3>
          </div>
          
          <button
            onClick={() => { setActiveTab('overview'); setShowAddForm(false); }}
            className={`flex items-center gap-3.5 w-full h-12 px-4 font-display text-xs font-bold uppercase tracking-widest transition-all border-0 rounded-none cursor-pointer text-left ${
              activeTab === 'overview' 
                ? 'bg-action-dark text-white shadow-sm border-l-4 border-l-accent-red' 
                : 'bg-transparent text-action-dark hover:bg-brand-bg hover:pl-5'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5 stroke-2" />
            Overview Stats
          </button>

          <button
            onClick={() => { setActiveTab('catalog'); }}
            className={`flex items-center gap-3.5 w-full h-12 px-4 font-display text-xs font-bold uppercase tracking-widest transition-all border-0 rounded-none cursor-pointer text-left ${
              activeTab === 'catalog' 
                ? 'bg-action-dark text-white shadow-sm border-l-4 border-l-accent-red' 
                : 'bg-transparent text-action-dark hover:bg-brand-bg hover:pl-5'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5 stroke-2" />
            Manage Catalog
          </button>

          <button
            onClick={() => { setActiveTab('articles'); setShowAddForm(false); }}
            className={`flex items-center gap-3.5 w-full h-12 px-4 font-display text-xs font-bold uppercase tracking-widest transition-all border-0 rounded-none cursor-pointer text-left ${
              activeTab === 'articles' 
                ? 'bg-action-dark text-white shadow-sm border-l-4 border-l-accent-red' 
                : 'bg-transparent text-action-dark hover:bg-brand-bg hover:pl-5'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5 stroke-2" />
            Manage Articles
          </button>

          <button
            onClick={() => { setActiveTab('users'); setShowAddForm(false); }}
            className={`flex items-center gap-3.5 w-full h-12 px-4 font-display text-xs font-bold uppercase tracking-widest transition-all border-0 rounded-none cursor-pointer text-left ${
              activeTab === 'users' 
                ? 'bg-action-dark text-white shadow-sm border-l-4 border-l-accent-red' 
                : 'bg-transparent text-action-dark hover:bg-brand-bg hover:pl-5'
            }`}
          >
            <Users className="w-4.5 h-4.5 stroke-2" />
            Manage Users
          </button>

          <button
            onClick={() => { setActiveTab('transactions'); setShowAddForm(false); }}
            className={`flex items-center gap-3.5 w-full h-12 px-4 font-display text-xs font-bold uppercase tracking-widest transition-all border-0 rounded-none cursor-pointer text-left ${
              activeTab === 'transactions' 
                ? 'bg-action-dark text-white shadow-sm border-l-4 border-l-accent-red' 
                : 'bg-transparent text-action-dark hover:bg-brand-bg hover:pl-5'
            }`}
          >
            <Receipt className="w-4.5 h-4.5 stroke-2" />
            Manage Transactions
          </button>
        </aside>

        {/* Right Content Panel */}
        <main className="grow flex flex-col gap-6 text-left items-stretch">
          
          {loadingData ? (
            <div className="min-h-[350px] flex items-center justify-center bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] font-display text-sm font-bold uppercase tracking-widest text-text-muted">
              <div className="animate-pulse">LOADING SYSTEM LEDGER...</div>
            </div>
          ) : (
            <>
              {/* Tab Content: OVERVIEW STATS */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 className="font-display text-4xl font-black text-action-dark uppercase tracking-tighter">OVERVIEW DASHBOARD</h2>
                    <p className="font-sans text-xs text-text-muted uppercase tracking-wider font-semibold">Real-time database records summary.</p>
                  </div>
                  
                  {/* Grid Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
                    {/* Stat Card 1 */}
                    <div className="bg-white p-6 border-4 border-action-dark relative overflow-hidden flex flex-col justify-center shadow-[6px_6px_0px_#000] group hover:-translate-y-1 transition-transform">
                      <ShoppingBag className="w-7 h-7 text-accent-red stroke-[2.5] mb-2" />
                      <span className="font-display text-4xl font-black text-action-dark leading-none">{stats.sneakers}</span>
                      <span className="font-display text-[9px] font-extrabold text-text-muted mt-2 uppercase tracking-widest">SNEAKERS IN CATALOG</span>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white p-6 border-4 border-action-dark relative overflow-hidden flex flex-col justify-center shadow-[6px_6px_0px_#000] group hover:-translate-y-1 transition-transform">
                      <Users className="w-7 h-7 text-action-dark stroke-[2.5] mb-2" />
                      <span className="font-display text-4xl font-black text-action-dark leading-none">{stats.users}</span>
                      <span className="font-display text-[9px] font-extrabold text-text-muted mt-2 uppercase tracking-widest">REGISTERED ROOKIES</span>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white p-6 border-4 border-action-dark relative overflow-hidden flex flex-col justify-center shadow-[6px_6px_0px_#000] group hover:-translate-y-1 transition-transform">
                      <Flame className="w-7 h-7 text-orange-600 stroke-[2.5] mb-2" />
                      <span className="font-display text-4xl font-black text-action-dark leading-none">{stats.cartItems}</span>
                      <span className="font-display text-[9px] font-extrabold text-text-muted mt-2 uppercase tracking-widest">ITEMS IN BASKETS</span>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white p-6 border-4 border-action-dark relative overflow-hidden flex flex-col justify-center shadow-[6px_6px_0px_#000] group hover:-translate-y-1 transition-transform">
                      <Heart className="w-7 h-7 text-accent-red stroke-[2.5] mb-2" />
                      <span className="font-display text-4xl font-black text-action-dark leading-none">{stats.savedPairs}</span>
                      <span className="font-display text-[9px] font-extrabold text-text-muted mt-2 uppercase tracking-widest">TOTAL SAVED CORES</span>
                    </div>

                    {/* Stat Card 5 */}
                    <div className="bg-white p-6 border-4 border-action-dark relative overflow-hidden flex flex-col justify-center shadow-[6px_6px_0px_#000] group hover:-translate-y-1 transition-transform">
                      <BookOpen className="w-7 h-7 text-green-600 stroke-[2.5] mb-2" />
                      <span className="font-display text-4xl font-black text-action-dark leading-none">{stats.articles || 0}</span>
                      <span className="font-display text-[9px] font-extrabold text-text-muted mt-2 uppercase tracking-widest">ARTICLES IN ARCHIVE</span>
                    </div>
                  </div>

                  {/* System Msg */}
                  <div className="bg-white border-4 border-action-dark p-6 md:p-8 text-left shadow-[6px_6px_0px_#000]">
                    <h4 className="font-display text-sm font-bold uppercase tracking-widest text-accent-red mb-3 border-b-2 border-action-dark pb-2">COMMAND SYSTEM MESSAGE</h4>
                    <p className="font-sans text-xs text-text-muted leading-relaxed font-semibold">
                      Welcome back, Chief Admin. This control ledger allows you to register fresh sneaker releases directly in the MySQL catalog. Deleting items is permanent and will cascade-delete them from customers' shopping bags. Use with absolute precision.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab Content: MANAGE CATALOG */}
              {activeTab === 'catalog' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h2 className="font-display text-4xl font-black text-action-dark uppercase tracking-tighter">CATALOG MANAGER</h2>
                      <p className="font-sans text-xs text-text-muted uppercase tracking-wider font-semibold">Verify drop catalogs, add new lines, or remove active drops.</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowAddForm(!showAddForm);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="bg-accent-red text-white font-display text-xs font-bold uppercase py-3.5 px-6 hover:bg-red-700 tracking-widest flex items-center justify-center gap-2 border-2 border-action-dark shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none cursor-pointer self-start"
                    >
                      {showAddForm ? (
                        <>
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>Cancel Form</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>Add New Sneaker</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Add Sneaker Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] mb-4"
                      >
                        <form onSubmit={handleCreateSneaker} className="p-6 md:p-8 flex flex-col gap-5 text-left">
                          <h3 className="font-display text-lg font-bold uppercase tracking-widest text-action-dark flex items-center gap-2 border-b-2 border-action-dark pb-2">
                            <PackagePlus className="w-5 h-5 text-accent-red" />
                            Register New Drop
                          </h3>

                          {errorMsg && (
                            <div className="bg-red-100 border-l-4 border-accent-red text-accent-red p-3 text-xs font-semibold uppercase tracking-widest shadow-sm">
                              {errorMsg}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Sneaker Name *</label>
                              <input 
                                type="text" required placeholder="Nike Ja 2 Mismatched" value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">ID Slug (Unique) *</label>
                              <input 
                                type="text" required placeholder="nike-ja-2-mismatched" value={id}
                                onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all lowercase rounded-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Price (USD) *</label>
                              <input 
                                type="number" required min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Colorway *</label>
                              <input 
                                type="text" required placeholder="Teal / Violet" value={color} onChange={(e) => setColor(e.target.value)}
                                className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Badge Type</label>
                              <select 
                                value={badge} onChange={(e) => setBadge(e.target.value)}
                                className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider cursor-pointer rounded-none"
                              >
                                {badgeOptions.map((opt) => (
                                  <option key={opt} value={opt}>{opt || 'None'}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Description *</label>
                            <textarea 
                              required rows={3} placeholder="A spectacular mismatched design for elite ballers..." value={description} onChange={(e) => setDescription(e.target.value)}
                              className="w-full p-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all resize-none rounded-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Main Image *</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input 
                                type="text" required placeholder="/src/assets/nike-ja3.png or select file..." value={image} onChange={(e) => setImage(e.target.value)}
                                className="grow h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none"
                              />
                              <input 
                                id="sneaker-file-picker"
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setImage(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label 
                                htmlFor="sneaker-file-picker"
                                className="h-11 bg-white hover:bg-action-dark hover:text-white border-2 border-action-dark text-action-dark font-display text-[10px] font-bold uppercase tracking-widest px-4 flex items-center justify-center cursor-pointer select-none grow-0 shrink-0"
                              >
                                Choose File
                              </label>
                            </div>
                            {image && (image.startsWith('data:') || image.startsWith('/') || image.startsWith('http')) && (
                              <div className="mt-2 w-20 h-20 border-2 border-action-dark p-1 bg-brand-bg flex items-center justify-center relative">
                                <img src={image} alt="Preview" className="max-w-full max-h-full object-contain" />
                                <button type="button" className="absolute -top-1.5 -right-1.5 bg-accent-red text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] cursor-pointer border-0" onClick={() => setImage('')}>×</button>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Sizes *</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {allSizes.map((size) => {
                                const isSelected = selectedSizes.includes(size);
                                return (
                                  <button
                                    type="button" key={size} onClick={() => handleSizeToggle(size)}
                                    className={`h-9 w-12 flex items-center justify-center font-display text-xs font-bold border-2 border-action-dark cursor-pointer transition-all ${
                                      isSelected ? 'bg-action-dark text-white' : 'bg-white text-action-dark hover:border-accent-red hover:text-accent-red'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Gallery Paths (Comma-separated)</label>
                            <input 
                              type="text" placeholder="/src/assets/2.png, /src/assets/3.png" value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)}
                              className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none"
                            />
                          </div>

                          <button
                            type="submit" disabled={loadingForm}
                            className="bg-action-dark text-white font-display text-xs font-bold uppercase tracking-widest py-4 hover:bg-accent-red cursor-pointer border-0 rounded-none disabled:bg-text-muted mt-2 shadow-lg"
                          >
                            {loadingForm ? 'LOGGING TO SERVER...' : 'PUBLISH DROP RECORD'}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Catalog Table */}
                  <div className="bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] overflow-x-auto">
                    <table className="w-full border-collapse font-sans text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-action-dark text-white font-display uppercase tracking-widest font-bold border-b-4 border-action-dark">
                          <th className="p-4 text-left">Image</th>
                          <th className="p-4 text-left">Name</th>
                          <th className="p-4 text-left">Color</th>
                          <th className="p-4 text-left">Price</th>
                          <th className="p-4 text-left">Badge</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalogList.map((sneaker) => (
                          <tr key={sneaker.id} className="border-b-2 border-action-dark/15 hover:bg-brand-bg/40 font-semibold text-text-main">
                            <td className="p-4">
                              <div className="w-12 h-12 bg-brand-bg border-2 border-action-dark/25 p-1 flex items-center justify-center">
                                <img src={sneaker.image} alt={sneaker.name} className="w-full h-full object-contain" />
                              </div>
                            </td>
                            <td className="p-4 font-display uppercase text-left tracking-tight">{sneaker.name}</td>
                            <td className="p-4 text-left uppercase text-[10px] text-text-muted">{sneaker.color}</td>
                            <td className="p-4 text-left text-accent-red font-display text-sm font-black">{formatIDR(sneaker.price)}</td>
                            <td className="p-4 text-left">
                              {sneaker.badge ? (
                                <span className="bg-accent-red text-white text-[9px] font-bold py-1 px-2.5 uppercase tracking-wider">
                                  {sneaker.badge}
                                </span>
                              ) : (
                                <span className="text-text-muted/40 font-normal">-</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteSneaker(sneaker.id)}
                                className="p-2 bg-transparent text-text-muted hover:text-accent-red hover:scale-110 transition-all border-0 cursor-pointer outline-none"
                                title="Delete Drop"
                              >
                                <Trash2 className="w-4.5 h-4.5 stroke-[2.5]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab Content: MANAGE ARTICLES */}
              {activeTab === 'articles' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h2 className="font-display text-4xl font-black text-action-dark uppercase tracking-tighter">ARTICLES MANAGER</h2>
                      <p className="font-sans text-xs text-text-muted uppercase tracking-wider font-semibold">Publish new editorial stories or wipe outdated literature drops.</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowAddArticleForm(!showAddArticleForm);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="bg-accent-red text-white font-display text-xs font-bold uppercase py-3.5 px-6 hover:bg-red-700 tracking-widest flex items-center justify-center gap-2 border-2 border-action-dark shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none cursor-pointer self-start"
                    >
                      {showAddArticleForm ? (
                        <>
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>Cancel Form</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>Compose Article</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Add Article Form */}
                  <AnimatePresence>
                    {showAddArticleForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] mb-4"
                      >
                        <form onSubmit={handleCreateArticle} className="p-6 md:p-8 flex flex-col gap-5 text-left">
                          <h3 className="font-display text-lg font-bold uppercase tracking-widest text-action-dark flex items-center gap-2 border-b-2 border-action-dark pb-2">
                            <BookOpen className="w-5 h-5 text-accent-red" />
                            Compose Article
                          </h3>

                          {errorMsg && (
                            <div className="bg-red-100 border-l-4 border-accent-red text-accent-red p-3 text-xs font-semibold uppercase tracking-widest shadow-sm">
                              {errorMsg}
                            </div>
                          )}

                          <div className="flex flex-col gap-1.5">
                            <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Article Title *</label>
                            <input 
                              type="text" required placeholder="The Evolution of Basketball Court Aesthetics" value={articleTitle}
                              onChange={(e) => setArticleTitle(e.target.value)}
                              className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Category *</label>
                              <select 
                                value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)}
                                className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider cursor-pointer rounded-none"
                              >
                                <option value="Culture">Culture</option>
                                <option value="Gear Analysis">Gear Analysis</option>
                                <option value="Training">Training</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Author *</label>
                              <input 
                                type="text" required placeholder="Sneak On Ears" value={articleAuthor} onChange={(e) => setArticleAuthor(e.target.value)}
                                className="w-full h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all uppercase tracking-wider rounded-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Cover Image *</label>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                  type="text" required placeholder="/src/assets/4.png or select file..." value={articleImage} onChange={(e) => setArticleImage(e.target.value)}
                                  className="grow h-11 px-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all rounded-none"
                                />
                                <input 
                                  id="article-file-picker"
                                  type="file" 
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setArticleImage(reader.result as string);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label 
                                  htmlFor="article-file-picker"
                                  className="h-11 bg-white hover:bg-action-dark hover:text-white border-2 border-action-dark text-action-dark font-display text-[10px] font-bold uppercase tracking-widest px-4 flex items-center justify-center cursor-pointer select-none grow-0 shrink-0"
                                >
                                  Choose File
                                </label>
                              </div>
                              {articleImage && (articleImage.startsWith('data:') || articleImage.startsWith('/') || articleImage.startsWith('http')) && (
                                <div className="mt-2 w-20 h-12 border-2 border-action-dark p-0.5 bg-brand-bg flex items-center justify-center relative">
                                  <img src={articleImage} alt="Preview" className="max-w-full max-h-full object-cover" />
                                  <button type="button" className="absolute -top-1.5 -right-1.5 bg-accent-red text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] cursor-pointer border-0" onClick={() => setArticleImage('')}>×</button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-display text-[10px] font-bold text-action-dark uppercase tracking-widest">Article Body Content *</label>
                            <textarea 
                              required rows={6} placeholder="Write the full content of the basketball article here..." value={articleContent} onChange={(e) => setArticleContent(e.target.value)}
                              className="w-full p-3 bg-brand-bg text-text-main font-semibold text-xs outline-none border-2 border-action-dark focus:border-accent-red transition-all resize-none rounded-none"
                            />
                          </div>

                          <button
                            type="submit" disabled={loadingForm}
                            className="bg-action-dark text-white font-display text-xs font-bold uppercase tracking-widest py-4 hover:bg-accent-red cursor-pointer border-0 rounded-none disabled:bg-text-muted mt-2 shadow-lg"
                          >
                            {loadingForm ? 'LOGGING TO SERVER...' : 'PUBLISH ARTICLE'}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Articles Table */}
                  <div className="bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] overflow-x-auto">
                    <table className="w-full border-collapse font-sans text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-action-dark text-white font-display uppercase tracking-widest font-bold border-b-4 border-action-dark">
                          <th className="p-4 text-left">Cover</th>
                          <th className="p-4 text-left">Title</th>
                          <th className="p-4 text-left">Category</th>
                          <th className="p-4 text-left">Author</th>
                          <th className="p-4 text-left">Published</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articlesList.map((art) => (
                          <tr key={art.id} className="border-b-2 border-action-dark/15 hover:bg-brand-bg/40 font-semibold text-text-main">
                            <td className="p-4">
                              <div className="w-16 h-10 bg-brand-bg border-2 border-action-dark/25 overflow-hidden p-0.5">
                                <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="p-4 font-display uppercase text-left tracking-tight max-w-xs truncate">{art.title}</td>
                            <td className="p-4 text-left">
                              <span className="bg-action-dark text-white text-[9px] font-bold py-0.5 px-2 uppercase tracking-widest">
                                {art.category}
                              </span>
                            </td>
                            <td className="p-4 text-left uppercase text-[10px] text-text-muted">{art.author}</td>
                            <td className="p-4 text-left text-text-muted">{new Date(art.created_at).toLocaleDateString()}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="p-2 bg-transparent text-text-muted hover:text-accent-red hover:scale-110 transition-all border-0 cursor-pointer outline-none"
                                title="Delete Article"
                              >
                                <Trash2 className="w-4.5 h-4.5 stroke-[2.5]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab Content: MANAGE USERS */}
              {activeTab === 'users' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-4xl font-black text-action-dark uppercase tracking-tighter">USER ACCOUNTS LEDGER</h2>
                    <p className="font-sans text-xs text-text-muted uppercase tracking-wider font-semibold">Monitor registered hooper accounts, edit roles, or delete credentials.</p>
                  </div>

                  <div className="bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] overflow-x-auto">
                    <table className="w-full border-collapse font-sans text-xs min-w-[500px]">
                      <thead>
                        <tr className="bg-action-dark text-white font-display uppercase tracking-widest font-bold border-b-4 border-action-dark">
                          <th className="p-4 text-left">ID</th>
                          <th className="p-4 text-left">Username</th>
                          <th className="p-4 text-left">Email Address</th>
                          <th className="p-4 text-center">User Role</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((u) => (
                          <tr key={u.id} className="border-b-2 border-action-dark/15 hover:bg-brand-bg/40 font-semibold text-text-main">
                            <td className="p-4 text-left text-text-muted">#{u.id}</td>
                            <td className="p-4 text-left font-display uppercase tracking-tight">{u.username}</td>
                            <td className="p-4 text-left lowercase text-text-muted">{u.email}</td>
                            <td className="p-4 text-center">
                              {u.id === user.id ? (
                                <span className="inline-block text-[9px] font-bold py-1 px-3.5 uppercase tracking-widest bg-accent-red text-white">
                                  {u.role} (YOU)
                                </span>
                              ) : (
                                <select
                                  value={u.role}
                                  onChange={async (e) => {
                                    const newRole = e.target.value;
                                    if (window.confirm(`Are you sure you want to change the role of hooper "${u.username}" to "${newRole}"?`)) {
                                      try {
                                        await api.updateUserRole(u.id, newRole);
                                        setSuccessMsg("USER ROLE UPDATED SECURELY!");
                                        setTimeout(() => setSuccessMsg(''), 3000);
                                        fetchData();
                                      } catch (err: any) {
                                        alert(err.message || 'Error occurred while updating user role.');
                                      }
                                    }
                                  }}
                                  className="bg-brand-bg border-2 border-action-dark font-display text-[9px] font-bold p-1 uppercase tracking-widest outline-none cursor-pointer rounded-none"
                                >
                                  <option value="customer">customer</option>
                                  <option value="admin">admin</option>
                                </select>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {u.id !== user.id ? (
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Are you sure you want to delete user "${u.username}"? This action is permanent and cannot be undone.`)) {
                                      try {
                                        await api.deleteUser(u.id);
                                        setSuccessMsg("USER ACCOUNT DELETED SECURELY.");
                                        setTimeout(() => setSuccessMsg(''), 3000);
                                        fetchData();
                                      } catch (err: any) {
                                        alert(err.message || 'Error occurred while deleting user.');
                                      }
                                    }
                                  }}
                                  className="p-2 bg-transparent text-text-muted hover:text-accent-red hover:scale-110 transition-all border-0 cursor-pointer outline-none"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4.5 h-4.5 stroke-[2.5]" />
                                </button>
                              ) : (
                                <span className="text-text-muted/40 font-normal">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab Content: MANAGE TRANSACTIONS */}
              {activeTab === 'transactions' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-4xl font-black text-action-dark uppercase tracking-tighter">TRANSACTION LEDGER</h2>
                    <p className="font-sans text-xs text-text-muted uppercase tracking-wider font-semibold">Monitor purchases, update shipping statuses, or wipe historical transaction records.</p>
                  </div>

                  <div className="bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] overflow-x-auto">
                    <table className="w-full border-collapse font-sans text-xs min-w-[700px]">
                      <thead>
                        <tr className="bg-action-dark text-white font-display uppercase tracking-widest font-bold border-b-4 border-action-dark">
                          <th className="p-4 text-left">Order ID</th>
                          <th className="p-4 text-left">Hooper Info</th>
                          <th className="p-4 text-left">Items Locked</th>
                          <th className="p-4 text-left">Total Paid</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center font-display text-xs font-bold text-text-muted uppercase tracking-widest bg-brand-bg/10">
                              No transactions recorded in the network.
                            </td>
                          </tr>
                        ) : (
                          ordersList.map((order) => (
                            <tr key={order.id} className="border-b-2 border-action-dark/15 hover:bg-brand-bg/40 font-semibold text-text-main">
                              <td className="p-4 text-left font-display uppercase tracking-tight text-action-dark">
                                <div className="flex flex-col">
                                  <span>{order.id}</span>
                                  <span className="text-[9px] text-text-muted font-bold mt-0.5">{new Date(order.created_at).toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="p-4 text-left">
                                <div className="flex flex-col text-[10px] uppercase text-text-muted">
                                  <span className="font-display font-black text-action-dark">{order.username}</span>
                                  <span>{order.email}</span>
                                  <span className="text-[9px] mt-0.5 tracking-tight font-medium">To: {order.shipping_name} • {order.shipping_detail}</span>
                                </div>
                              </td>
                              <td className="p-4 text-left">
                                <div className="flex flex-col gap-1.5 py-1">
                                  {order.items && order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-white border border-action-dark/10 p-0.5 flex items-center justify-center shrink-0">
                                        <img src={item.image || '/src/assets/giannis-immortality-white.png'} alt={item.sneaker_name} className="w-full h-full object-contain" />
                                      </div>
                                      <span className="text-[10px] text-action-dark uppercase font-bold max-w-[120px] truncate">{item.sneaker_name}</span>
                                      <span className="text-[9px] text-text-muted">({item.size} x{item.quantity})</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 text-left text-accent-red font-display text-sm font-black">
                                {formatIDR(order.total_amount)}
                              </td>
                              <td className="p-4 text-center">
                                <select
                                  value={order.status}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    try {
                                      await api.updateOrderStatus(order.id, newStatus);
                                      setSuccessMsg("TRANSACTION STATUS UPDATED SECURELY.");
                                      setTimeout(() => setSuccessMsg(''), 3000);
                                      fetchData();
                                    } catch (err: any) {
                                      alert(err.message || "Failed to update status");
                                    }
                                  }}
                                  className={`font-display text-[9px] font-bold p-1 uppercase tracking-widest border-2 border-action-dark rounded-none cursor-pointer outline-none ${
                                    order.status === 'paid'
                                      ? 'bg-green-600 text-white border-green-700'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-600 text-white border-blue-700'
                                      : order.status === 'completed'
                                      ? 'bg-action-dark text-white border-action-dark'
                                      : 'bg-accent-red text-white border-red-700'
                                  }`}
                                >
                                  <option value="pending" className="bg-white text-action-dark">pending</option>
                                  <option value="paid" className="bg-white text-action-dark">paid</option>
                                  <option value="shipped" className="bg-white text-action-dark">shipped</option>
                                  <option value="completed" className="bg-white text-action-dark">completed</option>
                                  <option value="cancelled" className="bg-white text-action-dark">cancelled</option>
                                </select>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Are you sure you want to delete order "${order.id}"? This cannot be undone.`)) {
                                      try {
                                        await api.deleteOrder(order.id);
                                        setSuccessMsg("TRANSACTION LEDGER REMOVED SECURELY.");
                                        setTimeout(() => setSuccessMsg(''), 3000);
                                        fetchData();
                                      } catch (err: any) {
                                        alert(err.message || "Failed to delete order");
                                      }
                                    }
                                  }}
                                  className="p-2 bg-transparent text-text-muted hover:text-accent-red hover:scale-110 transition-all border-0 cursor-pointer outline-none"
                                  title="Delete Transaction"
                                >
                                  <Trash2 className="w-4.5 h-4.5 stroke-[2.5]" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </main>

      </div>

    </div>
  );
};
