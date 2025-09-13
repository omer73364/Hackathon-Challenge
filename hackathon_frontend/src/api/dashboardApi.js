import baseURL from "./baseUrl";

/**
 * جلب بيانات الداشبورد من الخادم
 * @returns {Promise<Object>} بيانات الداشبورد
 */
export const getDashboardData = async () => {
  try {
    const response = await baseURL.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب بيانات الداشبورد:', error);
    throw error;
  }
};