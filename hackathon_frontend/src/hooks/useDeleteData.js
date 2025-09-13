import baseURL from "../Api/baseURL";
import Cookies from "js-cookie";

/**
 * حذف البيانات بدون توكن
 * @param {string} url - مسار API
 * @param {Object} params - معلمات الطلب (config)
 * @returns {Promise<any>} البيانات المستجابة
 */
const useDeleteData = async (url, params) => {
  try {
    const res = await baseURL.delete(url, params);
    return res.data;
  } catch (error) {
    console.error("Error in useDeleteData:", error);
    throw error;
  }
};

/**
 * حذف البيانات مع توكن المصادقة
 * @param {string} url - مسار API
 * @param {Object} params - معلمات إضافية (اختياري)
 * @returns {Promise<any>} البيانات المستجابة
 */
const useDeleteDataWithToken = async (url, params = {}) => {
  try {
    const token = Cookies.get("token");
    
    // دمج معلمات المستخدم مع إعدادات التوكن
    const config = {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
      ...params
    };
    
    const res = await baseURL.delete(url, config);
    return res.data;
  } catch (error) {
    console.error("Error in useDeleteDataWithToken:", error);
    throw error;
  }
};

export { useDeleteData, useDeleteDataWithToken };
