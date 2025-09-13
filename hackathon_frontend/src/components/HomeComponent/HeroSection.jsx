import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
      <div className="container relative max-w-4xl mx-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] opacity-30 sm:left-[calc(50%-30rem)]
 sm:w-[72.1875rem]"
          />
        </div>
        <div className="mb-6">
          <span className="px-4 py-2 bg-muted shadow-md rounded-2xl text-black font-semibold text-sm dark:text-white">
            {t("hero.welcome")}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight dark:text-white">
          {t("hero.title")}
        </h1>

        <p className="text-gray-500 text-base sm:text-lg italic mb-8 max-w-2xl mx-auto">
          "{t("hero.subtitle")}"
        </p>

        {/* الأزرار */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-2xl transition-colors duration-200 font-medium text-sm sm:text-base"
            onClick={() => {
              const element = document.getElementById('how-to-use');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {t("hero.exploreNow")}
          </button>
          
          <Link
            to="/check"
            className="bg-customZahraa hover:bg-customZahraaH text-white py-3 px-6 rounded-2xl transition-colors duration-200 font-medium text-sm sm:text-base inline-block"
          >
            {t("navbar.check")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
