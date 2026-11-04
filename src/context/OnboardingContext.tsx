import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export interface FilePreview {
  file?: File;
  url?: string;
}

export interface DigitalFingerprint {
  fullName: string;
  signatureHash: string;
  timestamp: string;
  deviceFingerprint: string;
  contractHash: string;
}

export interface OnboardingData {
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  profilePhoto?: FilePreview;
  idCardFront?: FilePreview;
  idCardBack?: FilePreview;
  termsAccepted: boolean;
  contractRead: boolean;
  confirmedFullName: string;
  signatureDataUrl: string;
  signatureHash: string;
  fingerprint?: DigitalFingerprint;
  requestId?: string;
  requestSubmittedAt?: string;
}

export interface OnboardingContextType {
  data: OnboardingData;
  contractText: string;
  contractHash: string;
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  updateFilePreview: (field: 'profilePhoto' | 'idCardFront' | 'idCardBack', file?: File, url?: string) => void;
  generateFingerprint: () => void;
  submitOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const defaultContractText = `Employment Contract\n\nThis contract outlines the responsibilities, rights, and obligations of the employee. The employee agrees to provide services in accordance with company policy and local labor regulations. The company retains the right to approve, archive, and manage the final contract files securely.`;

const simpleHash = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `HASH-${Math.abs(hash)}`;
};

const defaultData: OnboardingData = {
  fullNameAr: '',
  fullNameEn: '',
  phone: '',
  profilePhoto: undefined,
  idCardFront: undefined,
  idCardBack: undefined,
  termsAccepted: false,
  contractRead: false,
  confirmedFullName: '',
  signatureDataUrl: '',
  signatureHash: '',
  fingerprint: undefined,
  requestId: undefined,
  requestSubmittedAt: undefined,
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [data, setData] = useState<OnboardingData>(defaultData);

  const contractText = useMemo(() => defaultContractText, []);
  const contractHash = useMemo(() => simpleHash(contractText), [contractText]);

  const updateField = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateFilePreview = (field: 'profilePhoto' | 'idCardFront' | 'idCardBack', file?: File, url?: string) => {
    setData((prev) => ({
      ...prev,
      [field]: file || url ? { file, url } : undefined,
    }));
  };

  const generateFingerprint = () => {
    if (!data.confirmedFullName || !data.signatureDataUrl) return;

    const signatureHash = simpleHash(data.signatureDataUrl);
    const timestamp = new Date().toISOString();
    const deviceFingerprint = `${navigator.userAgent} | ${navigator.platform} | ${window.innerWidth}x${window.innerHeight}`;

    const fingerprint = {
      fullName: data.confirmedFullName,
      signatureHash,
      timestamp,
      deviceFingerprint,
      contractHash,
    };

    setData((prev) => ({
      ...prev,
      signatureHash,
      fingerprint,
    }));
  };

  const submitOnboarding = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const requestId = `REQ-${Date.now().toString().slice(-6)}`;
    const requestSubmittedAt = new Date().toISOString();

    setData((prev) => ({
      ...prev,
      requestId,
      requestSubmittedAt,
    }));

    setUser({
      ...user,
      authStatus: 'pending_approval',
      requestId,
      requestSubmittedAt,
    });

    navigate('/pending-approval');
  };

  const resetOnboarding = () => {
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        contractText,
        contractHash,
        updateField,
        updateFilePreview,
        generateFingerprint,
        submitOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
