import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProgress } from "../state/useProgress";
import { useEffect, useState } from "react";
import { soundManager } from "../utils/soundManager";

export default function Dashboard() {
  const { t } = useTranslation();
  const { progress, getDailyChallenge } = useProgress();
  const navigate = useNavigate();
  const [dailyChallenge, setDailyChallenge] = useState(getDailyChallenge());
  
  useEffect(() => {
    setDailyChallenge(getDailyChallenge());
  }, [progress.dailyChallenge, getDailyChallenge]);

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
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">{t("dashboard.daily")}</p>
            {dailyChallenge?.completed && (
              <span className="text-xs font-bold bg-night/20 px-2 py-1 rounded-full">
                ✓ {t("common.completed")}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-1">
            {dailyChallenge ? t(`skill.${dailyChallenge.skill}`) : t("dashboard.challengeTitle")}
          </h2>
          <p className="mt-2 text-night/80">
            {dailyChallenge && !dailyChallenge.completed && (
              <>
                {t("dashboard.challengeProgress", { 
                  progress: dailyChallenge.progress, 
                  target: dailyChallenge.target 
                })} • {dailyChallenge.reward} {t("nav.coins")}
              </>
            )}
            {dailyChallenge?.completed && t("dashboard.challengeComplete")}
            {!dailyChallenge && t("dashboard.challengeBody")}
          </p>
          {dailyChallenge && !dailyChallenge.completed && (
            <div className="mt-3 w-full bg-night/20 rounded-full h-2">
              <div 
                className="bg-night h-2 rounded-full transition-all duration-300"
                style={{ width: `${(dailyChallenge.progress / dailyChallenge.target) * 100}%` }}
              />
            </div>
          )}
          <button
            onClick={() => {
              soundManager.play('click');
              navigate("/practice", { state: { skill: dailyChallenge?.skill } });
            }}
            className="mt-4 inline-block rounded-full bg-night px-4 py-2 text-white font-semibold hover:bg-night/90 transition"
            disabled={dailyChallenge?.completed}
          >
            {dailyChallenge?.completed ? t("dashboard.completed") : t("common.goPractice")}
          </button>
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
