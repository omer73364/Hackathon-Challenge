import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import UploadFingerPrint from "./UploadFingerPrint";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lottie from "lottie-react";

import successAnimation from "../assets/Fingerprint Verification.json";
import failAnimation from "../assets/Wrong fingerprint.json";
import noData from "../assets/nodata.json";

const CheckFingerPrint = () => {
  const { t } = useTranslation();
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [fingerprintData, setFingerprintData] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFingerprintImage, setShowFingerprintImage] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

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
        if (
          data.name &&
          typeof data.matched === "boolean" &&
          data.fingerprint_img
        ) {
          setFingerprintData(data);
          setShowFingerprintImage(false);
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

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    console.log("تم رفع الصورة:", imageData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center transition-colors duration-300">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {t("fingerprint.title", "Fingerprint Scanner")}
          </h1>
          <span
            className={`inline-block px-4 py-2 rounded-md text-sm font-medium ${
              connectionStatus === "Connected"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : connectionStatus === "Error"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {t(`fingerprint.${connectionStatus.toLowerCase()}`)}
          </span>
        </div>

        {/* Fingerprint Animation */}
        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 flex items-center justify-center">
            {fingerprintData && !showFingerprintImage ? (
              <Lottie
                animationData={
                  fingerprintData.matched ? successAnimation : failAnimation
                }
                loop={false}
                style={{ width: 500, height: 500 }}
                onComplete={() => setShowFingerprintImage(true)}
              />
            ) : fingerprintData && showFingerprintImage ? (
              <img
                src={fingerprintData.fingerprint_img}
                alt="Fingerprint"
                className="w-40 h-40 object-contain rounded-full border dark:border-gray-600"
              />
            ) : (
              <Lottie
                animationData={noData}
                loop={true}
                style={{ width: 200, height: 200 }}
              />
            )}
          </div>
        </div>

        {/* Status and Results */}
        <div className="space-y-4">
          {fingerprintData ? (
            <>
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("fingerprint.user")}
                  </div>
                  <div className="text-gray-800 dark:text-gray-100 font-medium">
                    {fingerprintData?.name || t("fingerprint.unknown")}
                  </div>
                </div>

                {fingerprintData?.matched ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                      {t("fingerprint.score")}
                    </div>
                    <div className="text-gray-800 dark:text-gray-100 font-medium">
                      {Number(fingerprintData?.score * 100).toFixed(2) + "%" ||
                        "N/A"}
                    </div>
                  </div>
                ) : null}

                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("fingerprint.latency")}
                  </div>
                  <div className="text-gray-800 dark:text-gray-100 font-medium">
                    {Number(fingerprintData?.latency).toFixed(2) + "s" ||
                      t("fingerprint.unknown")}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-600 dark:text-gray-200 mb-2">
                {t("fingerprint.waiting")}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t(
                  "fingerprint.waitingDesc",
                  "Place your finger on the scanner"
                )}
              </p>
            </div>
          )}
        </div>

        {/* <div className="text-gray-600 dark:text-gray-300 text-lg font-bold mt-2">or</div> */}

        {/* <div className="mt-6">
          <Button
            onClick={() => setShowUploadModal(true)}
            className="w-full bg-customZahraa hover:bg-customZahraaH"
          >
            Upload FingerPrint Image
          </Button>
        </div> */}
      </div>

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="dark:bg-gray-800 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{t("fingerprint.upload.title")}</DialogTitle>
          </DialogHeader>
          <UploadFingerPrint
            onImageUpload={handleImageUpload}
            onSuccess={() => setShowUploadModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckFingerPrint;
