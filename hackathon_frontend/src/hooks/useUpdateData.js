import baseUrl from "../Api/baseURL";
import Cookies from "js-cookie";

/**
 * تحديث البيانات مع صورة وتوكن المصادقة
 * @param {string} url - مسار API
 * @param {FormData} params - بيانات النموذج متضمنة الصور
 * @returns {Promise<Object>} كائن الاستجابة
 */
const useUpdateDataWithImage = async (url, params) => {
  try {
    const token = Cookies.get("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };
    const res = await baseUrl.put(url, params, config);
    return res;
  } catch (error) {
    console.error("Error in useInUpdateDataWithImage:", error);
    throw error;
  }
};

/**
 * تحديث البيانات بدون توكن
 * @param {string} url - مسار API
 * @param {Object} params - البيانات المراد تحديثها
 * @returns {Promise<Object>} كائن الاستجابة
 */
const useUpdateData = async (url, params) => {
  try {
    const res = await baseUrl.put(url, params);
    return res;
  } catch (error) {
    console.error("Error in useUpdateData:", error);
    throw error;
  }
};

/**
 * تحديث البيانات مع توكن المصادقة باستخدام PUT
 * @param {string} url - مسار API
 * @param {Object} params - البيانات المراد تحديثها
 * @returns {Promise<Object>} كائن الاستجابة
 */
const useUpdateDataWithToken = async (url, params) => {
  try {
    const token = Cookies.get("token");

    const config = {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    };
    const res = await baseUrl.put(url, params, config);
    return res;
  } catch (error) {
    console.error("Error in useUpdateDataWithToken:", error);
    throw error;
  }
};

/**
 * تحديث البيانات الجزئي مع توكن المصادقة باستخدام PATCH
 * @param {string} url - مسار API
 * @param {Object} params - البيانات المراد تحديثها جزئيًا
 * @returns {Promise<Object>} كائن الاستجابة
 */
const usePatchDataWithToken = async (url, params) => {
  try {
    const token = Cookies.get("token");

    const config = {
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
    };
    const res = await baseUrl.patch(url, params, config);
    return res;
  } catch (error) {
    console.error("Error in usePatchDataWithToken:", error);
    throw error;
  }
};

export { useUpdateDataWithImage, useUpdateData, useUpdateDataWithToken, usePatchDataWithToken };
