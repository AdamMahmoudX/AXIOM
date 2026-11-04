import React from 'react';

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="relative">
      <div className="absolute -inset-10 rounded-full bg-blue-500/20 animate-ping" />
      <div className="relative w-16 h-16 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" />
    </div>
  </div>
);

export default PageLoader;