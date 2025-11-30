import { useTranslation } from "react-i18next";
import { ACHIEVEMENTS } from "../state/achievements";
import { useProgress } from "../state/useProgress";

export default function ProgressPage() {
  const { t } = useTranslation();
  const { progress } = useProgress();
  const skills = Object.entries(progress.skills);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-night">{t("progress.title")}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-night/70 capitalize">{t(`skill.${key as string}`)}</p>
            <p className="text-xl font-bold text-night">
              {t("common.level")} {value.level}
            </p>
            <p className="text-sm text-night/60">
              {t("progress.correct", { correct: value.correctAnswers, total: value.totalAnswers })}
            </p>
            {key === "multiplication" && (
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-night/70">
                {Object.entries(value.tables).map(([table, data]) => (
                  <div key={table} className="rounded-lg bg-slate-100 px-2 py-1">
                    {t("progress.tableStat", { table, correct: data.correct, total: data.total })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-night">{t("progress.badges")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((badge) => {
            const unlocked = progress.achievements.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-4 shadow-sm ${
                  unlocked ? "border-mint/60 bg-mint/20" : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-lg font-bold text-night">{badge.title}</p>
                <p className="text-sm text-night/70">{badge.description}</p>
                <p className="mt-2 text-xs font-semibold text-night/60">
                  {unlocked ? t("progress.unlocked") : t("progress.locked")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
