import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BookOpen, Clock, Tag } from 'lucide-react';
import { api } from '../api';
import { Article } from '../types';

export const ArticleDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getArticle(Number(id))
      .then((data) => {
        setArticle(data);
      })
      .catch((err) => {
        console.error('Error fetching article detail:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[450px] flex items-center justify-center bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] font-display text-sm font-bold uppercase tracking-widest text-text-muted">
        <div className="animate-pulse font-display">DECRYPTING ARCHIVE INDEX...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20 max-w-md mx-auto select-none">
        <div className="w-16 h-16 bg-red-100 text-accent-red flex items-center justify-center rounded-full text-2xl font-bold mx-auto mb-4 border-2 border-accent-red">
          <BookOpen className="w-8 h-8 text-accent-red stroke-[2.5]" />
        </div>
        <h2 className="font-display text-3xl font-black text-action-dark uppercase tracking-tighter">
          ARTICLE NOT FOUND
        </h2>
        <p className="text-text-muted text-xs mt-2 uppercase tracking-widest leading-relaxed">
          The requested literature index is unavailable in the database.
        </p>
        <button
          type="button"
          onClick={() => navigate('/articles')}
          className="mt-6 bg-action-dark text-white py-3 px-8 hover:bg-accent-red transition-all cursor-pointer font-display text-xs font-bold uppercase tracking-widest border-0"
        >
          BACK TO ARCHIVES
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 font-sans text-left relative z-10 flex flex-col gap-6 select-none max-w-4xl mx-auto">
      
      {/* Back to list trigger */}
      <div className="border-b-4 border-action-dark pb-4 flex justify-between items-center">
        <button 
          onClick={() => navigate('/articles')}
          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase text-action-dark hover:text-accent-red transition-all cursor-pointer p-1 bg-transparent border-0 outline-none"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          Return to Archives
        </button>
        <span className="font-display text-xs font-black text-accent-red uppercase tracking-[0.25em]">
          INTELLIGENCE READOUT
        </span>
      </div>

      {/* Main Editorial Header block */}
      <header className="flex flex-col gap-4">
        {/* Category Tag */}
        <div className="flex gap-2">
          <span className="bg-action-dark text-white font-display text-[9px] font-bold py-1 px-3.5 uppercase tracking-widest flex items-center gap-1 shadow-sm">
            <Tag className="w-3 h-3 text-accent-red" />
            {article.category}
          </span>
          <span className="bg-brand-bg text-action-dark border border-action-dark/15 font-display text-[9px] font-bold py-1 px-3.5 uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3 h-3" />
            5 MIN READ
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-action-dark leading-tight">
          {article.title}
        </h1>

        {/* Metadata info */}
        <div className="flex flex-wrap gap-4 items-center text-text-muted font-display text-[10px] font-bold uppercase tracking-wider mt-1 border-y border-action-dark/10 py-3">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-accent-red text-white flex items-center justify-center rounded-full text-xs font-black">
              {article.author.charAt(0)}
            </div>
            <span>BY {article.author}</span>
          </div>
          <span className="text-action-dark/20">•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-accent-red" />
            <span>PUBLISHED {new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      {/* Big Brutalist Editorial Banner Cover */}
      <section className="bg-white border-4 border-action-dark p-1.5 shadow-[6px_6px_0px_#000]">
        <div className="relative w-full aspect-21/10 overflow-hidden bg-brand-bg">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      </section>

      {/* Editorial Content block */}
      <section className="flex flex-col md:flex-row gap-8 items-start mt-4">
        
        {/* Left Side: Article Content */}
        <article className="grow bg-white border-2 border-action-dark p-6 md:p-8 shadow-sm">
          <p className="font-sans text-sm md:text-base text-text-main leading-relaxed font-medium whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:font-display first-letter:float-left first-letter:mr-2.5 first-letter:text-accent-red">
            {article.content}
          </p>
        </article>

        {/* Right Side: Brutalist Promotion Widget */}
        <aside className="w-full md:w-72 flex flex-col gap-6 shrink-0">
          <div className="bg-action-dark text-white p-6 border-2 border-action-dark shadow-[4px_4px_0px_#ff2a51]">
            <h4 className="font-display text-sm font-black uppercase tracking-wider mb-2 text-accent-red">SYSTEM INTEGRATION</h4>
            <p className="font-sans text-xs text-white/80 leading-relaxed font-semibold mb-5">
              Need fresh grip and premium rebound response? Check out our high-performance lineup of basketball cores in the shop.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-accent-red hover:bg-red-700 text-white font-display text-[10px] font-bold uppercase py-3 tracking-widest transition-all cursor-pointer border-0 rounded-none shadow-md"
            >
              EXPLORE CORES →
            </button>
          </div>

          <div className="bg-white p-6 border-2 border-action-dark shadow-[4px_4px_0px_#000] text-left">
            <h4 className="font-display text-xs font-black uppercase tracking-wider text-action-dark mb-2.5 border-b border-action-dark/10 pb-1.5">TERMS OF USE</h4>
            <p className="font-sans text-[10px] text-text-muted leading-relaxed font-semibold">
              All editorial materials and data projections belong to the Sneak On Ears Archive system. Unauthorized distribution or copying is strictly locked.
            </p>
          </div>
        </aside>

      </section>

    </div>
  );
};
