import React from "react";
import { useTranslation } from 'react-i18next';
import { Hand, ScanLine, Database, CheckCircle } from 'lucide-react';

const HowUseSection = () => {
  const { t } = useTranslation();
  
  return (
    <div id="how-to-use" className="min-h-screen px-0 py-0 transition-colors duration-300">
      {/* Step 1 */}
      <div className="bg-fuchsia-50 dark:bg-gray-900 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              {t('howToUse.step1.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {t('howToUse.step1.description')}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-[200px] h-[200px] bg-gradient-to-br from-fuchsia-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Hand className="w-24 h-24 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-blue-50 dark:bg-gray-800 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="flex justify-center">
            <div className="w-[200px] h-[200px] bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
              <ScanLine className="w-24 h-24 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              {t('howToUse.step2.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {t('howToUse.step2.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-fuchsia-50 dark:bg-gray-900 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              {t('howToUse.step3.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {t('howToUse.step3.description')}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-[200px] h-[200px] bg-gradient-to-br from-fuchsia-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Database className="w-24 h-24 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-blue-50 dark:bg-gray-800 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="flex justify-center">
            <div className="w-[200px] h-[200px] bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-24 h-24 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              {t('howToUse.step4.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {t('howToUse.step4.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowUseSection;
