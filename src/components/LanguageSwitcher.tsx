import { useTranslation } from "react-i18next";

const LANG_KEY = "lang";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("sv") ? "sv" : "en";

  const toggle = () => {
    const next = current === "en" ? "sv" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem(LANG_KEY, next);
  };

  return (
    <button
      onClick={toggle}
      className="rounded-full bg-night text-white px-3 py-2 text-xs font-bold shadow-sm hover:bg-night/90 transition"
      aria-label="Switch language"
    >
      {current === "en" ? "EN / SV" : "SV / EN"}
    </button>
  );
}
