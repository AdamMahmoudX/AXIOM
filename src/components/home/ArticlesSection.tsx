import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArticleCard } from '../cards';

const ArticlesSection: React.FC = () => {
  const { t } = useLanguage();
  const articles = [
    { slug: 'future-of-ai', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', title: 'The Future of AI: Transforming Tomorrow\'s Technology', description: 'Explore how artificial intelligence is reshaping industries, from healthcare to finance, and what it means for the future of human-machine collaboration.', category: 'Artificial Intelligence', readTime: 8 },
    { slug: 'react-framework', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', title: 'React Framework: Modern Web Development Guide', description: 'Master React development with this comprehensive guide covering hooks, components, state management, and best practices.', category: 'Web Development', readTime: 10 },
    { slug: 'cybersecurity-basics', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', title: 'Cybersecurity Basics: Protecting Your Digital Assets', description: 'Learn essential cybersecurity practices to safeguard your business from online threats. From encryption to threat detection, master the fundamentals.', category: 'Security', readTime: 12 },
  ];

  return (
    <section id="articles" className="py-32 bg-gradient-to-b from-[#080812] to-[#0B0B0B] relative overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-full h-full" style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom left, rgba(34, 211, 238, 0.1) 0%, transparent 50%)
          `
        }} />
        <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-violet-600/15 to-purple-600/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/5 blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-violet-500/20 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-500/20 rounded-bl-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center border border-violet-500/30">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-violet-400 text-sm font-medium tracking-wider uppercase">
              Articles &amp; Insights
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('articles.insights')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('articles.exploreInsights')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard key={article.slug} {...article} delay={index * 100} cardIndex={index} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/articles/future-of-ai" className="group inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600/15 to-purple-600/15 border border-violet-500/30 hover:border-violet-400/50 hover:from-violet-600/25 hover:to-purple-600/25 transition-all duration-500 cursor-pointer">
            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-gray-300 group-hover:text-white font-medium transition-colors">{t('articles.exploreKnowledgeBase')}</span>
            <svg className="w-5 h-5 text-violet-400 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;