/**
 * تنسيق التاريخ بتنسيق يوم شهر سنة (الشهر باللغة العربية)
 * @param {string|Date} dateString - التاريخ المراد تنسيقه
 * @returns {string} التاريخ المنسق أو سلسلة فارغة في حالة عدم وجود تاريخ
 */
const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // validate date
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateString);
      return "";
    }

    // Example: 12 September 2025
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedDate;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export default formatDate;

