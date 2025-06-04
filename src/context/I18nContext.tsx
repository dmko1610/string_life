import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import i18n from '@/lib/i18n';

type Locale = 'en' | 'ru';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const loadLocale = async () => {
      const stored = await AsyncStorage.getItem('locale');
      const system = i18n.defaultLocale || 'en';
      const finalLocale = stored === 'ru' || stored === 'en' ? stored : system;

      i18n.locale = finalLocale;
      setLocaleState(finalLocale as Locale);
    };
    loadLocale();
  }, []);

  const setLocale = async (newLocale: Locale) => {
    i18n.locale = newLocale;
    await AsyncStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    setLocale(newLocale);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');

  return context;
}
