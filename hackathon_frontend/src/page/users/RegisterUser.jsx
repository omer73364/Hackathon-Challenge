import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import baseURL from "../../api/baseUrl";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import noData from "../../assets/nodata.json";
import toast, { Toaster } from "react-hot-toast";

const RegisterUser = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    phone: "",
    address: "",
    gender: "",
    fingerprints: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [receivedFingerprint, setReceivedFingerprint] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const connect = () => {
    const ws = new WebSocket("ws://10.21.55.109:8081");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("Connected");
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.fingerprint_img) {
          setReceivedFingerprint(data.fingerprint_img);
        }
      } catch {
        console.log("Received non-JSON data:", event.data);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("Disconnected");
      reconnectTimer.current = setTimeout(() => {
        connect();
      }, 1000);
    };

    ws.onerror = () => {
      setConnectionStatus("Error");
      ws.close();
    };
  };

  const addReceivedFingerprint = () => {
    if (receivedFingerprint) {
      setFormData((prev) => ({
        ...prev,
        fingerprints: [...prev.fingerprints, receivedFingerprint],
      }));
      setReceivedFingerprint(null);
      toast.success(
        t("registerUser.messages.fingerprintAdded", "تم إضافة البصمة بنجاح")
      );
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (
      !formData.name ||
      !formData.birthday ||
      !formData.phone ||
      !formData.address ||
      !formData.gender
    ) {
      toast.error(
        t("registerUser.messages.fillRequired", "يرجى ملء جميع الحقول المطلوبة")
      );
      setLoading(false);
      return;
    }

    // Validate fingerprints array
    if (formData.fingerprints.length === 0) {
      toast.error(
        t(
          "registerUser.messages.addFingerprintFirst",
          "يرجى إضافة بصمة واحدة على الأقل"
        )
      );
      setLoading(false);
      return;
    }

    try {
      const response = await baseURL.post("/person", formData);
      toast.success(
        t("registerUser.messages.success", "تم تسجيل المستخدم بنجاح!")
      );
      setFormData({
        name: "",
        birthday: "",
        phone: "",
        address: "",
        gender: "",
        fingerprints: [],
      });
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(
        t("registerUser.messages.error", "حدث خطأ أثناء تسجيل المستخدم")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container mx-auto p-6 max-w-2xl ${isRTL ? "rtl" : "ltr"}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("registerUser.title", "تسجيل مستخدم جديد")}
          </CardTitle>
          <CardDescription className="text-center">
            {t(
              "registerUser.description",
              "يرجى ملء جميع الحقول المطلوبة لتسجيل مستخدم جديد"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("registerUser.fields.name", "الاسم")} *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t(
                  "registerUser.placeholders.name",
                  "أدخل الاسم الكامل"
                )}
                required
                className={`w-full ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Birthday Field */}
            <div className="space-y-2">
              <Label
                htmlFor="birthday"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("registerUser.fields.birthday", "تاريخ الميلاد")} *
              </Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleInputChange}
                required
                className={`w-full ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("registerUser.fields.phone", "رقم الهاتف")} *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t(
                  "registerUser.placeholders.phone",
                  "أدخل رقم الهاتف"
                )}
                required
                className={`w-full ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("registerUser.fields.address", "العنوان")} *
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={t(
                  "registerUser.placeholders.address",
                  "أدخل العنوان الكامل"
                )}
                required
                className={`w-full min-h-[100px] ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <Label
                htmlFor="gender"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("registerUser.fields.gender", "الجنس")} *
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.gender}
              >
                <SelectTrigger
                  className={`w-full ${isRTL ? "text-right" : "text-left"}`}
                >
                  <SelectValue
                    placeholder={t(
                      "registerUser.placeholders.gender",
                      "اختر الجنس"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    {t("registerUser.gender.male", "ذكر")}
                  </SelectItem>
                  <SelectItem value="female">
                    {t("registerUser.gender.female", "أنثى")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Socket Connection Status */}
            <div className="space-y-2">
              <Label className={isRTL ? "text-right" : "text-left"}>
                {t("registerUser.socketStatus", "حالة الاتصال بالماسح")}
              </Label>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                    connectionStatus === "Connected"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : connectionStatus === "Error"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {t(
                    `fingerprint.${connectionStatus.toLowerCase()}`,
                    connectionStatus
                  )}
                </span>
              </div>
            </div>

            {/* Received Fingerprint Display */}
            {receivedFingerprint && (
              <div className="space-y-2">
                <Label className={isRTL ? "text-right" : "text-left"}>
                  {t("registerUser.receivedFingerprint", "البصمة المستقبلة")}
                </Label>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <img
                    src={receivedFingerprint}
                    alt="Received Fingerprint"
                    className="w-16 h-16 object-contain rounded border"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t(
                        "registerUser.fingerprintReceived",
                        "تم استقبال بصمة جديدة من الماسح"
                      )}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={addReceivedFingerprint}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {t("registerUser.buttons.addReceived", "إضافة")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReceivedFingerprint(null)}
                  >
                    {t("registerUser.buttons.ignore", "تجاهل")}
                  </Button>
                </div>
              </div>
            )}

            {/* Fingerprint Scanner Status */}
            {!receivedFingerprint && (
              <div className="space-y-2">
                <Label className={isRTL ? "text-right" : "text-left"}>
                  {t("registerUser.scannerStatus", "ماسح البصمات")}
                </Label>
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3">
                      <Lottie
                        animationData={noData}
                        loop={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {connectionStatus === "Connected"
                        ? t(
                            "registerUser.waitingForFingerprint",
                            "في انتظار بصمة من الماسح..."
                          )
                        : t(
                            "registerUser.scannerDisconnected",
                            "الماسح غير متصل"
                          )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Fingerprints Array Field */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  className={`text-lg font-semibold ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("registerUser.fields.fingerprints", "البصمات")} *
                </Label>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {formData.fingerprints.length}{" "}
                  {t("registerUser.fingerprintCount", "بصمة")}
                </span>
              </div>

              {formData.fingerprints.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  {formData.fingerprints.map((fingerprint, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4  "
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                          <img
                            src={fingerprint}
                            alt={`Fingerprint ${index + 1}`}
                            className="w-20 h-20 object-contain rounded-lg border-2 border-white dark:border-gray-700 shadow-md"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("registerUser.fingerprintLabel", "البصمة")} #
                            {index + 1}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("registerUser.verified", "تم التحقق")}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className=" opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600"
                          onClick={() => {
                            const newFingerprints =
                              formData.fingerprints.filter(
                                (_, i) => i !== index
                              );
                            setFormData((prev) => ({
                              ...prev,
                              fingerprints: newFingerprints,
                            }));
                            toast.success(
                              t(
                                "registerUser.messages.fingerprintRemoved",
                                "تم حذف البصمة"
                              )
                            );
                          }}
                        >
                          {t("registerUser.buttons.delete", "حذف")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full"
                    >
                      <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14.05 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-2.04-1.34-3.30 0-1.26.47-2.44 1.34-3.30.19-.19.50-.19.69 0 .19.19.19.50 0 .69-.68.68-1.04 1.58-1.04 2.61 0 1.03.36 1.93 1.04 2.61.19.19.19.50 0 .69-.09.1-.22.15-.34.15zm7.17 0c-.13 0-.26-.05-.35-.15-.19-.19-.19-.50 0-.69.68-.68 1.04-1.58 1.04-2.61 0-1.03-.36-1.93-1.04-2.61-.19-.19-.19-.50 0-.69.19-.19.50-.19.69 0 .87.87 1.34 2.04 1.34 3.30 0 1.26-.47 2.44-1.34 3.30-.09.1-.22.15-.34.15zM12 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("registerUser.noFingerprints", "لا توجد بصمات مضافة")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t(
                      "registerUser.addFingerprintDesc",
                      "استخدم الماسح أعلاه لإضافة بصمات جديدة"
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-customZahraa hover:bg-customZahraaH"
              disabled={loading}
            >
              {loading
                ? t("registerUser.buttons.submitting", "جاري التسجيل...")
                : t("registerUser.buttons.submit", "تسجيل المستخدم")}
            </Button>

            {/* Toast Container */}
            <Toaster
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  direction: isRTL ? "rtl" : "ltr",
                  fontFamily: isRTL ? "Cairo, sans-serif" : "Inter, sans-serif",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterUser;
