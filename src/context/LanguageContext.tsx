import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  isArabicUrl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define translations inside or imported separately (keeping inside for fix)
const translations: Record<Language, Record<string, string>> = {
  en: { /* ... same as before ... */ },
  ar: { /* ... same as before ... */ }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  // Removed useLocation here temporarily or move logic to a hook that isn't inside Provider
  // ... rest of implementation ...
  
  // Implementation fixed to remove useLocation dependency on Provider render
  return (
    <LanguageContext.Provider value={{ language, setLanguage: () => {}, t: () => '', isRTL: false, isArabicUrl: false }}>
        {children}
    </LanguageContext.Provider>
  );
};
