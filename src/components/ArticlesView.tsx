import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Calendar, User, BookOpen } from 'lucide-react';
import { api } from '../api';
import { Article } from '../types';

export const ArticlesView: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    api.getArticles()
      .then((data) => {
        setArticles(data);
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Culture', 'Gear Analysis', 'Training'];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && article.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-10 pb-16 text-left select-none">
      
      {/* Header Title section */}
      <section className="border-b-4 border-action-dark pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-action-dark">
              BASKETBALL INTELLIGENCE
            </h1>
            <p className="font-sans text-xs md:text-sm text-text-muted uppercase tracking-wider font-bold mt-1">
              COURT CULTURE, SNEAKER PSYCHOLOGY, AND HIGH-OCTANE AGILITY BLUEPRINTS.
            </p>
          </div>
          <span className="font-display text-xs font-semibold bg-accent-red text-white py-1 px-3 tracking-widest self-start sm:self-auto uppercase">
            {filteredArticles.length} PIECES ARCHIVED
          </span>
        </div>
      </section>

      {/* Utility Filter & Search Bar */}
      <section className="bg-white border-2 border-action-dark p-6 rounded-none flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="font-display text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 text-action-dark">
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            Category:
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider rounded-none cursor-pointer transition-all border-0 ${
                  selectedCategory === category
                    ? 'bg-action-dark text-white'
                    : 'bg-brand-bg hover:bg-surface-container text-action-dark border border-action-dark/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted stroke-[2.5]" />
          </div>
          <input
            type="text"
            placeholder="SEARCH ARTICLES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-brand-bg text-action-dark font-display font-semibold text-xs rounded-none border border-black/10 focus:border-action-dark uppercase tracking-widest outline-none"
          />
        </div>
      </section>

      {/* Main Content Grid */}
      {loading ? (
        <div className="min-h-[350px] flex items-center justify-center bg-white border-4 border-action-dark shadow-[6px_6px_0px_#000] font-display text-sm font-bold uppercase tracking-widest text-text-muted">
          <div className="animate-pulse">DECRYPTING ARCHIVE ARCHIVES...</div>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <motion.div
              key={article.id}
              onClick={() => navigate(`/articles/${article.id}`)}
              className="bg-white border-2 border-action-dark flex flex-col justify-between p-5 shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              {/* Cover Image Container */}
              <div className="relative w-full aspect-16/10 overflow-hidden bg-brand-bg border-2 border-action-dark/25 p-1 mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-400 group-hover:scale-103"
                />
                <span className="absolute bottom-2 left-2 bg-accent-red text-white font-display text-[9px] font-bold py-0.5 px-2 uppercase tracking-widest">
                  {article.category}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-2.5 grow">
                <h3 className="font-display text-lg md:text-xl font-extrabold uppercase tracking-tight text-action-dark group-hover:text-accent-red transition-colors duration-300 line-clamp-2 leading-tight">
                  {article.title}
                </h3>
                <p className="font-sans text-xs text-text-muted leading-relaxed line-clamp-3 font-medium">
                  {article.content}
                </p>
              </div>

              {/* Card Footer Info */}
              <div className="mt-5 pt-4 border-t border-action-dark/10 flex justify-between items-center text-text-muted font-display text-[9px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-accent-red" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-action-dark/30 p-16 text-center shadow-inner">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto animate-bounce opacity-40 mb-3" />
          <p className="font-display text-lg font-bold uppercase text-active-dark tracking-wide">
            NO ARTICLES FOUND IN THIS STACK
          </p>
          <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
            Try searching for something else or changing the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-6 font-display text-xs font-bold text-white bg-action-dark py-2 px-6 hover:bg-accent-red transition-all cursor-pointer border-0"
          >
            RESET DISCOVER
          </button>
        </div>
      )}

    </div>
  );
};
