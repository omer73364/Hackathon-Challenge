import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import baseURL from "../api/baseUrl";

const UploadFingerPrint = ({ onImageUpload, onSuccess }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await baseURL.post(
        "/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (onImageUpload) {
        onImageUpload({
          file: selectedFile,
          response: response.data,
        });
      }

      if (onSuccess) {
        onSuccess(); // إغلاق المودل بعد النجاح
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" accept="image/*" onChange={handleFileSelect} />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full bg-customZahraa hover:bg-customZahraaH"
      >
        {uploading
          ? t("fingerprint.upload.uploading")
          : t("fingerprint.upload.uploadButton")}
      </Button>
    </div>
  );
};

export default UploadFingerPrint;
