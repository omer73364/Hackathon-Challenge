import baseUrl from "../Api/baseURL";
import Cookies from "js-cookie";

/**
 * جلب البيانات بدون توكن
 * @param {string} url - مسار API
 * @param {Object} params - معلمات الطلب (config)
 * @returns {Promise<Object>} كامل كائن الاستجابة
 */
const useGetData = async (url, params) => {
  try {
    const res = await baseUrl.get(url, params);
    return res;
  } catch (error) {
    console.error("Error in useGetData:", error);
    throw error;
  }
};

/**
 * جلب البيانات مع توكن المصادقة
 * @param {string} url - مسار API
 * @param {Object} params - معلمات إضافية (اختياري)
 * @returns {Promise<Object>} كامل كائن الاستجابة
 */
const useGetDataToken = async (url, params = {}) => {
  try {
    const token = Cookies.get("token");
    
    // دمج معلمات المستخدم مع إعدادات التوكن
    const config = {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
      ...params
    };
    
    const res = await baseUrl.get(url, config);
    return res;
  } catch (error) {
    console.error("Error in useGetDataToken:", error);
    throw error;
  }
};

export { useGetData, useGetDataToken };
