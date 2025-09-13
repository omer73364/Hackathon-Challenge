/**
 * تنسيق الوقت من صيغة ISO إلى صيغة ساعة:دقيقة:ثانية
 * @param {string|Date} isoString - التاريخ بصيغة ISO أو كائن Date
 * @returns {string} الوقت المنسق (ساعة:دقيقة:ثانية) أو سلسلة فارغة إذا كان المدخل غير صالح
 */
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default formatTime;