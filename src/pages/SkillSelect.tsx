import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";

const skills = ["addition", "subtraction", "multiplication", "division"] as const;
const difficulties = ["easy", "medium", "hard"] as const;
const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function SkillSelect() {
  const { t } = useTranslation();
  const [skill, setSkill] = useState<(typeof skills)[number]>("multiplication");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("easy");
  const [table, setTable] = useState<number>(2);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-night">{t("skill.title")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s) => (
          <button
            key={s}
            onClick={() => setSkill(s)}
            className={`rounded-2xl border p-4 text-left shadow-sm transition ${
              skill === s ? "border-night bg-white" : "border-slate-200 bg-white/70 hover:border-night/30"
            }`}
          >
            <p className="font-semibold capitalize">{t(`skill.${s}`, s)}</p>
            <p className="text-sm text-night/60">{t("skill.cardDescription")}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-night/70">
          {t("skill.difficulty")}
        </span>
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              difficulty === d ? "bg-night text-white" : "bg-white border border-slate-200 hover:border-night/40"
            }`}
          >
            {t(`skill.difficultyOptions.${d}`)}
          </button>
        ))}
      </div>

      {skill === "multiplication" && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-night/80">{t("skill.table")}</p>
          <div className="flex flex-wrap gap-2">
            {tables.map((tNum) => (
              <button
                key={tNum}
                onClick={() => setTable(tNum)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  table === tNum
                    ? "bg-ocean text-white"
                    : "bg-white border border-slate-200 hover:border-ocean/50"
                }`}
              >
                {tNum}×
              </button>
            ))}
          </div>
        </div>
      )}

      <Link
        to="/exercise"
        className="inline-flex items-center gap-2 rounded-full bg-ocean px-5 py-3 text-white font-semibold shadow hover:bg-ocean/90"
        state={{ skill, difficulty, table }}
      >
        {t("skill.start")}
        <span className="text-lg">→</span>
      </Link>
    </div>
  );
}
