/**
 * Setup translation library
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageDetector from "i18next-browser-languagedetector";
import resource from "./translation.json";

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: resource,
    fallbackLng: "en",
    cleanCode: true,
    debug: true, // Find a way to control this property depending on the build type
    interpolation: { escapeValue: false },
  });
