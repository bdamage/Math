import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import NavStats from "../components/NavStats";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
    isActive ? "bg-white text-night shadow-sm" : "text-night/70 hover:text-night"
  }`;

export default function AppShell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if first time user
    const hasSeenOnboarding = localStorage.getItem("onboarding_complete");
    if (!hasSeenOnboarding && location.pathname !== "/onboarding") {
      navigate("/onboarding");
    }
  }, [navigate, location.pathname]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-mint/20">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-ocean/10 px-3 py-1 text-sm font-bold text-ocean">
              {t("common.brand")}
            </span>
            <NavStats />
          </div>
          <nav className="flex items-center gap-2 text-night">
            <NavLink className={navLinkClass} to="/" onClick={() => soundManager.play('click')}>
              {t("nav.home")}
            </NavLink>
            <NavLink className={navLinkClass} to="/practice" onClick={() => soundManager.play('click')}>
              {t("nav.practice")}
            </NavLink>
            <NavLink className={navLinkClass} to="/trainer" onClick={() => soundManager.play('click')}>
              {t("nav.trainer")}
            </NavLink>
            <NavLink className={navLinkClass} to="/room" onClick={() => soundManager.play('click')}>
              {t("nav.room")}
            </NavLink>
            <NavLink className={navLinkClass} to="/progress" onClick={() => soundManager.play('click')}>
              {t("nav.progress")}
            </NavLink>
            <NavLink className={navLinkClass} to="/settings" onClick={() => soundManager.play('click')}>
              {t("nav.settings")}
            </NavLink>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
