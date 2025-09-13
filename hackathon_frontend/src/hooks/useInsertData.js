import baseUrl from "../Api/baseURL";
import Cookies from "js-cookie";

/**
 * إدخال بيانات مع صورة وتوكن المصادقة
 * @param {string} url - مسار API
 * @param {FormData} formData - بيانات النموذج متضمنة الصور
 * @returns {Promise<any>} البيانات المستجابة
 */
const useInsertDataWithImage = async (url, formData) => {
  try {
    const token = Cookies.get("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };
    
    const res = await baseUrl.post(url, formData, config);
    return res.data;
  } catch (error) {
    console.error("Error in useInsertDataWithImage:", error);
    throw error;
  }
};

/**
 * إدخال بيانات بدون توكن
 * @param {string} url - مسار API
 * @param {Object} params - البيانات المراد إرسالها
 * @returns {Promise<Object>} كامل كائن الاستجابة
 */
const useInsertData = async (url, params) => {
  try {
    const res = await baseUrl.post(url, params);
    return res;
  } catch (error) {
    console.error("Error in useInsertData:", error);
    throw error;
  }
};

/**
 * إدخال بيانات مع توكن المصادقة
 * @param {string} url - مسار API
 * @param {Object} params - البيانات المراد إرسالها
 * @returns {Promise<Object>} كامل كائن الاستجابة
 */
const useInsertDataWithToken = async (url, params) => {
  try {
    const token = Cookies.get("token");

    const config = {
      headers: { Authorization: token ? `Bearer ${token}` : undefined, "Content-Type": "application/json" },
    };
    
    const res = await baseUrl.post(url, params, config);
    return res;
  } catch (error) {
    console.error("Error in useInsertDataWithToken:", error);
    throw error;
  }
};

export { useInsertData, useInsertDataWithImage, useInsertDataWithToken };
