import { useCallback } from 'react';

/**
 * Custom hook for smooth scrolling navigation
 * Preserves animation timing and visual effects
 * Router-safe navigation that doesn't break scroll behavior
 */

export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    // Remove the # from the section ID
    const id = sectionId.replace('#', '');

    // Find the element
    const element = document.getElementById(id);

    if (element) {
      // Get the navbar height to offset scroll
      const navbar = document.querySelector('nav');
      const navbarHeight = navbar ? (navbar as HTMLElement).offsetHeight : 0;

      // Calculate the target position
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementPosition - navbarHeight - 20; // 20px extra padding

      // Smooth scroll to the target
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleNavigationClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if it's an internal anchor link (starts with #)
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href);
    }
    // For other links, let the default behavior handle it
  }, [scrollToSection]);

  return { scrollToSection, handleNavigationClick };
};

export default useSmoothScroll;