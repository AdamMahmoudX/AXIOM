import React from 'react';
import { Navigation } from '../navigation';
import Footer from './Footer';

interface SharedLayoutProps {
  children: React.ReactNode;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
};

export default SharedLayout;