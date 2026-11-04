import React from 'react';

interface AXIOMXLogoProps {
  className?: string;
}

const AXIOMXLogo: React.FC<AXIOMXLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <img
        src="/axiomx-logo.png"
        alt="AXIOMX Logo"
        loading="eager"
        fetchPriority="high"
        className="h-16 w-36 object-contain bg-transparent block"
        style={{ maxWidth: '150px', maxHeight: '64px' }}
      />
    </div>
  );
};

export default AXIOMXLogo;