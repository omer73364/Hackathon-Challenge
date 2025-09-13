# دليل نظام الترجمة / Translation System Guide

## نظرة عامة / Overview

تم إضافة نظام ترجمة شامل للمشروع يدعم اللغتين العربية والإنجليزية مع دعم كامل للاتجاه من اليمين إلى اليسار (RTL).

A comprehensive translation system has been added to the project supporting both Arabic and English languages with full Right-to-Left (RTL) support.

## الميزات المضافة / Added Features

### 1. مكتبات الترجمة / Translation Libraries
- `i18next`: المكتبة الأساسية للترجمة
- `react-i18next`: تكامل React مع i18next
- `i18next-browser-languagedetector`: كشف اللغة تلقائياً

### 2. ملفات الترجمة / Translation Files
- `src/locales/en.json`: الترجمات الإنجليزية
- `src/locales/ar.json`: الترجمات العربية

### 3. المكونات المحدثة / Updated Components
- `HeroSection`: القسم الرئيسي
- `HowUseSection`: قسم كيفية الاستخدام
- `CheckFingerPrint`: صفحة فحص بصمة الإصبع
- `LanguageToggle`: مفتاح تبديل اللغة

### 4. دعم RTL / RTL Support
- تم إضافة ملف `src/rtl.css` لدعم الاتجاه من اليمين إلى اليسار
- تغيير اتجاه النص والعناصر تلقائياً عند التبديل للعربية

## كيفية الاستخدام / How to Use

### إضافة ترجمات جديدة / Adding New Translations

1. أضف المفاتيح الجديدة في ملفي الترجمة:
```json
// en.json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}

// ar.json
{
  "newSection": {
    "title": "عنوان جديد",
    "description": "وصف جديد"
  }
}
```

2. استخدم الترجمة في المكون:
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  );
};
```

### تبديل اللغة / Language Switching

يمكن للمستخدمين تبديل اللغة باستخدام الزر الموجود في أعلى يمين الشاشة. سيتم حفظ اللغة المختارة في التخزين المحلي.

Users can switch languages using the button in the top-right corner of the screen. The selected language will be saved in local storage.

## الملفات المعدلة / Modified Files

1. `src/main.jsx` - إضافة تهيئة i18n و RTL CSS
2. `src/App.jsx` - إضافة مكون تبديل اللغة
3. `src/components/HomeComponent/HeroSection.jsx` - تحديث النصوص
4. `src/components/HomeComponent/HowUseSection.jsx` - تحديث النصوص
5. `src/page/CheckFingerPrint.jsx` - تحديث النصوص

## الملفات الجديدة / New Files

1. `src/i18n.js` - إعداد نظام الترجمة
2. `src/locales/en.json` - الترجمات الإنجليزية
3. `src/locales/ar.json` - الترجمات العربية
4. `src/components/LanguageToggle.jsx` - مكون تبديل اللغة
5. `src/rtl.css` - أنماط دعم RTL

## ملاحظات مهمة / Important Notes

- يتم كشف اللغة تلقائياً بناءً على إعدادات المتصفح
- يتم حفظ اللغة المختارة في التخزين المحلي
- دعم كامل للاتجاه من اليمين إلى اليسار للغة العربية
- جميع النصوص في المشروع تم تحويلها لاستخدام نظام الترجمة

- Language is automatically detected based on browser settings
- Selected language is saved in local storage
- Full Right-to-Left (RTL) support for Arabic language
- All text in the project has been converted to use the translation system