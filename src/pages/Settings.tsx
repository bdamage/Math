import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProgress } from "../state/useProgress";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { reset } = useProgress();
  const [soundOn, setSoundOn] = useState(true);
  const [difficulty, setDifficulty] = useState("easy");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-night">{t("settings.title")}</h1>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-night">{t("settings.sound")}</p>
            <p className="text-sm text-night/60">{soundOn ? "On" : "Off"}</p>
          </div>
          <button
            onClick={() => setSoundOn((v) => !v)}
            className="rounded-full bg-night px-4 py-2 text-white font-semibold"
          >
            Toggle
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-night">{t("settings.difficulty")}</p>
            <p className="text-sm text-night/60">{difficulty}</p>
          </div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
        <p className="font-semibold text-night">{t("settings.reset")}</p>
        <p className="text-sm text-night/60">{t("settings.confirmReset")}</p>
        <button
          onClick={reset}
          className="mt-3 rounded-full bg-coral px-4 py-2 font-semibold text-white shadow hover:bg-coral/90"
        >
          {t("settings.reset")}
        </button>
      </div>
    </div>
  );
}
