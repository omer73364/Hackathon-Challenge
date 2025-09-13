import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
<button
  onClick={toggleLanguage}
  className="fixed top-20 right-2 sm:right-4 z-50 bg-gray-600 hover:bg-gray-700 text-white p-2 sm:p-3 rounded-full shadow-lg transition-colors duration-200"
>
  <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
</button>
  );
};

export default LanguageToggle;