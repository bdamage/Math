import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProgress } from "../state/useProgress";
import { generateQuestion, Question } from "../state/questionGenerator";
import { useEffect } from "react";
import { soundManager } from "../utils/soundManager";

const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function MultiplicationTrainer() {
  const { t } = useTranslation();
  const { logSession, addPoints, progress } = useProgress();
  const [mode, setMode] = useState<"practice" | "challenge">("practice");
  const [activeTable, setActiveTable] = useState<number>(2);
  const [question, setQuestion] = useState<Question>(() => generateQuestion("multiplication", "easy", 2));
  const [timer, setTimer] = useState(30);

  const askNext = (table: number) => setQuestion(generateQuestion("multiplication", "easy", table));

  useEffect(() => {
    if (mode !== "challenge") {
      setTimer(30);
      return;
    }
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          askNext(activeTable);
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mode, activeTable]);

  const handleChoice = (choice: number) => {
    const isCorrect = choice === question.answer;
    if (isCorrect) {
      soundManager.play('correct');
      addPoints(mode === "challenge" ? 10 : 5);
      soundManager.play('coin');
    } else {
      soundManager.play('incorrect');
    }
    logSession({ correct: isCorrect ? 1 : 0, total: 1, skill: "multiplication", table: activeTable });
    askNext(activeTable);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ocean">{t("trainer.title")}</p>
          <h1 className="text-3xl font-bold text-night">{t("trainer.heading", { table: activeTable })}</h1>
        </div>
        <div className="flex items-center gap-2">
          {["practice", "challenge"].map((m) => (
            <button
              key={m}
              onClick={() => {
                soundManager.play('click');
                setMode(m as typeof mode);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === m ? "bg-night text-white" : "bg-white border border-slate-200"
              }`}
            >
              {t(`trainer.${m as "practice" | "challenge"}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-night/80">{t("trainer.chooseTable")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tables.map((table) => (
            <button
              key={table}
              onClick={() => {
                setActiveTable(table);
                askNext(table);
              }}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                activeTable === table
                  ? "bg-ocean text-white"
                  : "bg-white border border-slate-200 hover:border-ocean/50"
              }`}
            >
              {table}×
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-night/70">
            {mode === "challenge" ? `${timer}s` : t("trainer.practice")}
          </p>
          <div className="text-sm text-night/70">
            {t("trainer.mastery")}: {progress.skills.multiplication.tables[activeTable]?.correct || 0}/20
          </div>
        </div>
        <p className="mt-4 text-center text-4xl font-bold text-night">{question.prompt}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {question.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-lg font-semibold transition hover:border-night/30"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
