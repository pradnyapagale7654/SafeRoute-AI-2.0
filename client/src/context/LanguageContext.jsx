import { useState } from "react";
import LanguageContext from "./languageContextValue";

const translations = {
  en: {
    home: "Home",
    safeRoute: "Safe Route",
    dashboard: "Dashboard",
    admin: "Admin",
    login: "Login",
    register: "Register",
    logout: "Logout",
    protectedSession: "Protected session",
    adminLabel: "Admin",
    personalCockpit: "Personal safety cockpit",
    greeting: "Good to see you",
    journeyMessage: "Your next journey starts with a little more information and a lot more control.",
    adminView: "Admin view",
    readiness: "Readiness",
    ready: "Ready",
    toolsOnline: "Your safety tools are online.",
    savedRoutes: "Saved routes",
    historyNext: "History storage is next.",
    quickAction: "Quick action",
    sosReady: "SOS ready",
    simulation: "Simulation mode for now.",
    toolkit: "Your safety toolkit",
    toolkitTitle: "Make the next move confidently.",
    planRoute: "Plan a safe route",
    routeDescription: "Compare your journey with road routing and safety analysis.",
    openPlanner: "Open planner →",
    trustedCircle: "Trusted circle",
    trustedDescription: "Add trusted contacts and live sharing when emergency services are connected.",
    comingNext: "Coming next",
    safetyPulse: "Safety pulse",
    pulseTitle: "Build trust with better data.",
    pulseDescription: "Your route analysis currently uses development sample data. Verified public safety sources will make this signal meaningful.",
    foundation: "Platform foundation 75%",
  },
  hi: {
    home: "होम",
    safeRoute: "सुरक्षित मार्ग",
    dashboard: "डैशबोर्ड",
    admin: "एडमिन",
    login: "लॉग इन",
    register: "रजिस्टर",
    logout: "लॉग आउट",
    protectedSession: "सुरक्षित सत्र",
    adminLabel: "एडमिन",
    personalCockpit: "व्यक्तिगत सुरक्षा केंद्र",
    greeting: "आपका स्वागत है",
    journeyMessage: "आपकी अगली यात्रा अधिक जानकारी और बेहतर नियंत्रण के साथ शुरू होती है।",
    adminView: "एडमिन दृश्य",
    readiness: "तैयारी",
    ready: "तैयार",
    toolsOnline: "आपके सुरक्षा उपकरण ऑनलाइन हैं।",
    savedRoutes: "सहेजे गए मार्ग",
    historyNext: "इतिहास जल्द उपलब्ध होगा।",
    quickAction: "त्वरित कार्य",
    sosReady: "SOS तैयार",
    simulation: "अभी सिमुलेशन मोड।",
    toolkit: "आपका सुरक्षा टूलकिट",
    toolkitTitle: "अगला कदम आत्मविश्वास से उठाएं।",
    planRoute: "सुरक्षित मार्ग बनाएं",
    routeDescription: "रोड रूटिंग और सुरक्षा विश्लेषण के साथ अपनी यात्रा की तुलना करें।",
    openPlanner: "प्लानर खोलें →",
    trustedCircle: "विश्वसनीय संपर्क",
    trustedDescription: "आपातकालीन सेवाएं जुड़ने पर विश्वसनीय संपर्क और लाइव शेयरिंग जोड़ें।",
    comingNext: "जल्द आ रहा है",
    safetyPulse: "सुरक्षा संकेत",
    pulseTitle: "बेहतर डेटा से विश्वास बनाएं।",
    pulseDescription: "आपके मार्ग का विश्लेषण अभी विकासात्मक नमूना डेटा का उपयोग करता है। सत्यापित सार्वजनिक डेटा इसे अधिक उपयोगी बनाएगा।",
    foundation: "प्लेटफॉर्म आधार 75%",
  },
  mr: {
    home: "होम",
    safeRoute: "सुरक्षित मार्ग",
    dashboard: "डॅशबोर्ड",
    admin: "अॅडमिन",
    login: "लॉग इन",
    register: "नोंदणी",
    logout: "लॉग आउट",
    protectedSession: "सुरक्षित सत्र",
    adminLabel: "अॅडमिन",
    personalCockpit: "वैयक्तिक सुरक्षा केंद्र",
    greeting: "तुम्हाला पुन्हा पाहून आनंद झाला",
    journeyMessage: "अधिक माहिती आणि उत्तम नियंत्रणासह तुमचा पुढील प्रवास सुरू करा।",
    adminView: "अॅडमिन दृश्य",
    readiness: "तयारी",
    ready: "तयार",
    toolsOnline: "तुमची सुरक्षा साधने ऑनलाइन आहेत।",
    savedRoutes: "जतन केलेले मार्ग",
    historyNext: "मार्ग इतिहास लवकरच उपलब्ध होईल।",
    quickAction: "जलद कृती",
    sosReady: "SOS तयार",
    simulation: "सध्या सिम्युलेशन मोड।",
    toolkit: "तुमचे सुरक्षा टूलकिट",
    toolkitTitle: "पुढचे पाऊल आत्मविश्वासाने उचला।",
    planRoute: "सुरक्षित मार्ग आखा",
    routeDescription: "रस्ता मार्ग आणि सुरक्षा विश्लेषणासह तुमच्या प्रवासाची तुलना करा।",
    openPlanner: "प्लानर उघडा →",
    trustedCircle: "विश्वासू संपर्क",
    trustedDescription: "आपत्कालीन सेवा जोडल्यावर विश्वासू संपर्क आणि लाइव्ह शेअरिंग जोडा।",
    comingNext: "लवकरच येत आहे",
    safetyPulse: "सुरक्षा संकेत",
    pulseTitle: "चांगल्या डेटाने विश्वास निर्माण करा।",
    pulseDescription: "तुमच्या मार्गाचे विश्लेषण सध्या विकासात्मक नमुना डेटा वापरते। सत्यापित सार्वजनिक डेटा हे अधिक उपयुक्त करेल।",
    foundation: "प्लॅटफॉर्म पाया 75%",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("safeRouteLanguage") || "en"
  );

  const changeLanguage = (nextLanguage) => {
    localStorage.setItem("safeRouteLanguage", nextLanguage);
    setLanguage(nextLanguage);
  };

  const translate = (key) => translations[language][key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}
