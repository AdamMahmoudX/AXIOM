import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FounderProfileModal } from '../modals';

const investorsData = [
  { id: 1, name: 'Sarah Chen', role: 'Lead Investor', contribution: 'Primary funding for AI division', info: 'Tech venture capitalist with 20+ years experience in Silicon Valley', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { id: 2, name: 'Marcus Williams', role: 'Strategic Partner', contribution: 'International market expansion', info: 'Former Fortune 500 executive turned investor', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { id: 3, name: 'Elena Rodriguez', role: 'Tech Advisor', contribution: 'AI & ML expertise', info: 'Pioneer in artificial intelligence research', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' }
];

const employeesData = [
  { id: 1, name: 'John Smith', position: 'Senior Developer', skills: ['React', 'TypeScript', 'Node.js'], status: 'Active', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { id: 2, name: 'Emma Wilson', position: 'UI/UX Designer', skills: ['Figma', 'Adobe XD', 'Prototyping'], status: 'Active', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  { id: 3, name: 'David Kim', position: 'Backend Engineer', skills: ['Python', 'Django', 'PostgreSQL'], status: 'Active', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { id: 4, name: 'Lisa Anderson', position: 'Project Manager', skills: ['Agile', 'Scrum', 'Jira'], status: 'Active', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { id: 5, name: 'Michael Brown', position: 'DevOps Engineer', skills: ['AWS', 'Docker', 'CI/CD'], status: 'Active', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { id: 6, name: 'Sophie Taylor', position: 'QA Engineer', skills: ['Selenium', 'Jest', 'Testing'], status: 'Active', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { id: 7, name: 'James Lee', position: 'Mobile Developer', skills: ['React Native', 'Swift', 'Kotlin'], status: 'Active', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
  { id: 8, name: 'Anna Martinez', position: 'Data Scientist', skills: ['Python', 'TensorFlow', 'NLP'], status: 'Active', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' }
];

const founderData = {
  name: 'Ahmed Hassan',
  role: 'Founder & CEO',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
};

const EmployeeCard: React.FC<{ employee: typeof employeesData[0] }> = ({ employee }) => {
  const { t } = useLanguage();

  const positionKeyMap: Record<string, string> = {
    'Senior Developer': 'role.seniorDeveloper',
    'UI/UX Designer': 'role.uiuxDesigner',
    'Backend Engineer': 'role.backendEngineer',
    'Project Manager': 'role.projectManager',
    'DevOps Engineer': 'role.devopsEngineer',
    'QA Engineer': 'role.qaEngineer',
    'Mobile Developer': 'role.mobileDeveloper',
    'Data Scientist': 'role.dataScientist',
  };

  const translatedPosition = positionKeyMap[employee.position] ? t(positionKeyMap[employee.position]) : employee.position;
  const translatedStatus = employee.status === 'Active' ? t('status.active') : t('status.inactive');

  return (
    <div className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-500">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <img src={employee.image} alt={employee.name} className="relative w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-cyan-500/50 transition-colors" />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#050505] ${employee.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold truncate group-hover:text-cyan-400 transition-colors">{employee.name}</h4>
          <p className="text-gray-400 text-sm truncate">{translatedPosition}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {employee.skills.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-gray-400">{skill}</span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${employee.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className="text-xs text-gray-500">{translatedStatus}</span>
      </div>

      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-2xl">
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/0 group-hover:border-cyan-500/50 transition-colors duration-500" />
      </div>
    </div>
  );
};

const InvestorCard: React.FC<{ investor: typeof investorsData[0] }> = ({ investor }) => {
  const { t } = useLanguage();

  const roleKeyMap: Record<string, string> = {
    'Lead Investor': 'role.leadInvestor',
    'Strategic Partner': 'role.strategicPartner',
    'Tech Advisor': 'role.techAdvisor',
  };

  const translatedRole = roleKeyMap[investor.role] ? t(roleKeyMap[investor.role]) : investor.role;

  return (
    <div className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-center gap-4">
        <img src={investor.image} alt={investor.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-purple-500/50 transition-colors" />
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold truncate group-hover:text-purple-400 transition-colors">{investor.name}</h4>
          <p className="text-purple-400 text-sm">{translatedRole}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-gray-400 text-sm">{t('section8.contribution')}: {investor.contribution}</p>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed">{investor.info}</p>
      </div>
    </div>
  );
};

const DevelopersSection: React.FC = () => {
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<'investors' | 'employees' | null>(null);
  const [showFounderProfile, setShowFounderProfile] = useState(false);

  return (
    <>
      <section id="developers" className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
              linear-gradient(225deg, rgba(34, 211, 238, 0.05) 0%, transparent 50%)
            `
          }} />
          <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/10 to-violet-500/5 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/5 blur-3xl" />
        </div>

        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-purple-500/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/20 rounded-br-3xl" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('developers.orgStructure')}</h2>
            <p className="text-gray-400 text-lg">{t('developers.exploreHierarchy')}</p>
          </div>

          <div className="relative">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
                  <stop offset="100%" stopColor="rgba(34, 211, 238, 0.8)" />
                </linearGradient>
              </defs>
              <line x1="50%" y1="180" x2="50%" y2="220" stroke="url(#lineGradient)" strokeWidth="2" />
              <line x1="25%" y1="220" x2="75%" y2="220" stroke="url(#lineGradient)" strokeWidth="2" />
              <line x1="25%" y1="220" x2="25%" y2="260" stroke="url(#lineGradient)" strokeWidth="2" />
              <line x1="75%" y1="220" x2="75%" y2="260" stroke="url(#lineGradient)" strokeWidth="2" />
            </svg>

            <div className="relative z-10 flex justify-center mb-8">
              <button
                onClick={() => setShowFounderProfile(true)}
                className="group relative px-8 py-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(139,92,246,0.3)]"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src={founderData.image} alt={founderData.name} className="relative w-20 h-20 rounded-full object-cover border-3 border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.5)]" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-[#050505] shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">{founderData.name}</h3>
                    <p className="text-purple-400 font-medium">{t('section8.founderRole')}</p>
                    <p className="text-gray-500 text-sm mt-1">{t('org.clickToView')}</p>
                  </div>
                  <svg className="w-6 h-6 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
                <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-purple-500/40 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-purple-500/40 rounded-tr-2xl" />
              </button>
            </div>

            <div className="relative flex justify-between mb-4 px-12">
              <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">{t('developers.investors')}</span>
              <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">{t('developers.team')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={() => setExpandedSection(expandedSection === 'investors' ? null : 'investors')}
                className={`group relative p-6 rounded-3xl bg-white/[0.02] border transition-all duration-500 ${
                  expandedSection === 'investors' ? 'border-purple-500/50 shadow-[0_0_50px_rgba(139,92,246,0.3)]' : 'border-white/5 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]'
                }`}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{t('developers.investors')}</h3>
                      <p className="text-gray-400 text-sm">{investorsData.length} {t('developers.strategicPartners')}</p>
                    </div>
                  </div>
                  <svg className={`w-6 h-6 text-purple-400 transition-transform duration-300 ${expandedSection === 'investors' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {expandedSection === 'investors' && (
                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 gap-4">
                    {investorsData.map((investor) => (
                      <InvestorCard key={investor.id} investor={investor} />
                    ))}
                  </div>
                )}
              </button>

              <button
                onClick={() => setExpandedSection(expandedSection === 'employees' ? null : 'employees')}
                className={`group relative p-6 rounded-3xl bg-white/[0.02] border transition-all duration-500 ${
                  expandedSection === 'employees' ? 'border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.3)]' : 'border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]'
                }`}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{t('developers.employees')}</h3>
                      <p className="text-gray-400 text-sm">{employeesData.length} {t('developers.teamMembers')}</p>
                    </div>
                  </div>
                  <svg className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${expandedSection === 'employees' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {expandedSection === 'employees' && (
                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                    {employeesData.map((employee) => (
                      <EmployeeCard key={employee.id} employee={employee} />
                    ))}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <FounderProfileModal isOpen={showFounderProfile} onClose={() => setShowFounderProfile(false)} />
    </>
  );
};

export default DevelopersSection;