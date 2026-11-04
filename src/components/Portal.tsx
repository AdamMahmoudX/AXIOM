import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

export const Portal: React.FC<PortalProps> = ({ children, containerId = 'portal-root' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create portal container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    return () => {
      // Cleanup is optional - container can persist across renders
    };
  }, [containerId]);

  if (!mounted) return null;

  const container = document.getElementById(containerId);
  if (!container) return null;

  return createPortal(children, container);
};

export default Portal;