import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProgress } from "../state/useProgress";

export default function Dashboard() {
  const { t } = useTranslation();
  const { progress } = useProgress();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-ocean">{t("dashboard.welcome")}</p>
          <h1 className="text-3xl font-bold text-night">{t("common.brand")}</h1>
          <p className="mt-2 text-night/70">{t("dashboard.daily")}: {t("dashboard.challengeBody")}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/trainer"
              className="rounded-xl bg-ocean px-4 py-3 text-white font-semibold shadow hover:bg-ocean/90"
            >
              {t("dashboard.practiceMultiplication")}
            </Link>
            <Link
              to="/exercise"
              className="rounded-xl bg-night px-4 py-3 text-white font-semibold shadow hover:bg-night/90"
            >
              {t("dashboard.cta")}
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label={t("nav.points")} value={progress.points} accent="bg-ocean/10" />
          <StatCard label={t("nav.coins")} value={progress.coins} accent="bg-sunshine/40" />
          <StatCard label={t("nav.streak")} value={progress.streakDays} accent="bg-coral/20" />
          <StatCard label={t("common.level")} value={progress.skills.multiplication.level} accent="bg-mint/40" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-sunshine to-coral text-night p-6 shadow-sm">
          <p className="text-sm font-semibold">{t("dashboard.daily")}</p>
          <h2 className="text-2xl font-bold mt-1">{t("dashboard.challengeTitle")}</h2>
          <p className="mt-2 text-night/80">{t("dashboard.challengeBody")}</p>
          <Link
            to="/practice"
            className="mt-4 inline-block rounded-full bg-night px-4 py-2 text-white font-semibold"
          >
            {t("common.goPractice")}
          </Link>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-night">{t("dashboard.mascotTitle")}</h3>
          <p className="text-night/70 mt-2">{t("dashboard.mascotBody")}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${accent}`}>
      <p className="text-sm text-night/70">{label}</p>
      <p className="text-2xl font-bold text-night">{value}</p>
    </div>
  );
}
