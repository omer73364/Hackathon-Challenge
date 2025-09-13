import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardData } from '../api/dashboardApi';

const Dashboard = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(t('dashboard.error'));
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
        </div>
        <div className={`text-${color}-500 text-4xl`}>{icon}</div>
      </div>
    </div>
  );

  const ComparisonCard = ({ title, today, yesterday, todayLabel = t('dashboard.today'), yesterdayLabel = t('dashboard.yesterday') }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{todayLabel}</span>
          <span className="text-2xl font-bold text-green-600">{today}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{yesterdayLabel}</span>
          <span className="text-2xl font-bold text-gray-500">{yesterday}</span>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('dashboard.change')}</span>
            <span className={`text-sm font-semibold ${
              today > yesterday ? 'text-green-600' : today < yesterday ? 'text-red-600' : 'text-gray-500'
            }`}>
              {today > yesterday ? '+' : ''}{today - yesterday}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('dashboard.subtitle')}</p>
        </div>

        {dashboardData && (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title={t('dashboard.totalPersons')}
                value={dashboardData.totalPersons}
                color="blue"
              />
              <StatCard
                title={t('dashboard.totalFingerprints')}
                value={dashboardData.totalFingerprints}
                color="purple"
              />
              <StatCard
                title={t('dashboard.successfulMatches')}
                value={dashboardData.totalMatched}
                color="green"
              />
              <StatCard
                title={t('dashboard.failedMatches')}
                value={dashboardData.totalUnmatched}
                color="red"
              />
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ComparisonCard
                title={t('dashboard.totalChecks')}
                today={dashboardData.checkedToday}
                yesterday={dashboardData.checkedYesterday}
              />
              <ComparisonCard
                title={t('dashboard.successfulMatches')}
                today={dashboardData.matchedToday}
                yesterday={dashboardData.matchedYesterday}
              />
              <ComparisonCard
                title={t('dashboard.failedMatches')}
                today={dashboardData.unmatchedToday}
                yesterday={dashboardData.unmatchedYesterday}
              />
            </div>

            {/* Daily Matches Chart */}
            {dashboardData.matchedPerDay && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('dashboard.dailyMatches')}</h3>
                <div className="space-y-4">
                  {Object.entries(dashboardData.matchedPerDay).map(([date, matches]) => (
                    <div key={date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{date}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((matches / Math.max(...Object.values(dashboardData.matchedPerDay))) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 min-w-[3rem] text-right">{matches}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Rate Card */}
            <div className="mt-8 bg-customZahraa rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">{t('dashboard.overallSuccessRate')}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {dashboardData.totalFingerprints > 0 
                      ? Math.round((dashboardData.totalMatched / dashboardData.totalFingerprints) * 100)
                      : 0}%
                  </p>
                  <p className="text-blue-100">{t('dashboard.ofTotalAttempts')}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;