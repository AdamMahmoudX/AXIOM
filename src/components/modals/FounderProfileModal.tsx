import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const founderData = {
  name: 'Ahmed Hassan',
  role: 'Founder & CEO',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  story: 'With over 15 years of experience in software development and business leadership, Ahmed founded AXIOMX with a vision to revolutionize the digital landscape. Starting from a small garage in San Francisco, he built the company into a global innovation hub.',
  vision: 'To empower businesses and individuals through cutting-edge technology solutions that bridge the gap between imagination and reality.',
  experience: [
    { year: '2010', title: 'Software Engineer at TechGiant', desc: 'Led development of enterprise systems' },
    { year: '2014', title: 'CTO at StartupXYZ', desc: 'Scaled team from 5 to 50 engineers' },
    { year: '2018', title: 'Founded AXIOMX', desc: 'Began building the future of digital experiences' },
    { year: '2024', title: 'Global Expansion', desc: 'Expanded operations to 3 continents' }
  ],
  skills: ['Strategic Planning', 'System Architecture', 'Team Leadership', 'Innovation Management', 'Business Development'],
  goals: 'To create a sustainable technology ecosystem that drives innovation, empowers talent, and delivers exceptional value to clients worldwide.',
  technologies: ['React', 'Node.js', 'Python', 'AWS', 'Kubernetes', 'GraphQL', 'Machine Learning', 'Blockchain']
};

interface FounderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FounderProfileModal: React.FC<FounderProfileModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 rounded-3xl shadow-[0_0_80px_rgba(139,92,246,0.3)] overflow-hidden">
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-purple-500/40 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-purple-500/40 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-cyan-500/40 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-500/40 rounded-br-3xl" />

          <div className="relative px-8 pt-8 pb-6">
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-red-500/50 transition-all duration-300">
              <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl" />
                <img src={founderData.image} alt={founderData.name} className="relative w-32 h-32 rounded-full object-cover border-4 border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.5)]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">{founderData.name}</h2>
              <p className="text-purple-400 text-lg font-medium">{founderData.role}</p>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                {t('developers.founderStory')}
              </h3>
              <p className="text-gray-300 leading-relaxed">{founderData.story}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {t('developers.vision')}
              </h3>
              <p className="text-gray-300 leading-relaxed">{founderData.vision}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t('developers.experience')}
              </h3>
              <div className="space-y-4">
                {founderData.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 text-center">
                      <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-sm font-medium">{exp.year}</span>
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-purple-500/30 pl-4 relative">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                      <h4 className="text-white font-medium">{exp.title}</h4>
                      <p className="text-gray-400 text-sm">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">{t('developers.skills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {founderData.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">{t('developers.technologies')}</h3>
                <div className="flex flex-wrap gap-2">
                  {founderData.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                {t('developers.goals')}
              </h3>
              <p className="text-gray-300 leading-relaxed">{founderData.goals}</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default FounderProfileModal;