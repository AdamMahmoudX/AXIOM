import React from 'react';
import HeroSection from './HeroSection';
import DevelopersSection from './DevelopersSection';
import ServicesSection from './ServicesSection';
import ProjectsSection from './ProjectsSection';
import ArticlesSection from './ArticlesSection';

const HomePage: React.FC = () => {
  return (
    <div id="main-content" className="min-h-screen bg-[#050505]">
      <HeroSection />
      <DevelopersSection />
      <ServicesSection />
      <ProjectsSection />
      <ArticlesSection />
    </div>
  );
};

export default HomePage;