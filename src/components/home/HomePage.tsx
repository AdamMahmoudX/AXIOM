import React from 'react';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import ProjectsSection from './ProjectsSection';

const HomePage: React.FC = () => {
  return (
    <div id="main-content" className="min-h-screen bg-[#050505]">
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
    </div>
  );
};

export default HomePage;