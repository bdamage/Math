import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { generateQuestion, Difficulty, Skill, Question } from "../state/questionGenerator";
import { useProgress } from "../state/useProgress";
import Confetti from "../components/Confetti";
import MultiplicationVisual from "../components/MultiplicationVisual";

const ROUND_LENGTH = 10;

export default function Exercise() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { skill?: Skill; difficulty?: Difficulty; table?: number }) || {};
  const skill = state.skill || "multiplication";
  const difficulty = state.difficulty || "easy";
  const table = state.table;
  const { addPoints, logSession, updateDailyChallenge } = useProgress();

  const [question, setQuestion] = useState<Question>(() => generateQuestion(skill, difficulty, table));
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setQuestion(generateQuestion(skill, difficulty, table));
    setRoundIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  }, [skill, difficulty, table]);

  const progress = useMemo(() => `${roundIndex + 1}/${ROUND_LENGTH}`, [roundIndex]);

  const handleAnswer = (value: number) => {
    if (finished || feedback) return; // Prevent double-clicking
    const isCorrect = value === question.answer;
    setFeedback(isCorrect ? "correct" : "incorrect");
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) addPoints(5);
    setScore(newScore);

    const nextRoundIndex = roundIndex + 1;
    if (nextRoundIndex >= ROUND_LENGTH) {
      setFinished(true);
      logSession({ correct: newScore, total: ROUND_LENGTH, skill, table });
      // Update daily challenge progress
      updateDailyChallenge(skill, ROUND_LENGTH);
      // Show confetti for good performance
      if (newScore >= ROUND_LENGTH * 0.8) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      return;
    }

    setTimeout(() => {
      setQuestion(generateQuestion(skill, difficulty, table));
      setRoundIndex(nextRoundIndex);
      setFeedback(null);
    }, 1000); // Increased to 1 second for kids to see feedback
  };

  // Extract numbers from question for visual aid
  const questionParts = question.prompt.match(/(\d+)/g);
  const showVisual = skill === "multiplication" && questionParts && difficulty === "easy";

  return (
    <>
      <Confetti show={showConfetti} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-night">{t("exercise.question")}</h1>
          <span className="rounded-full bg-night text-white px-3 py-1 text-sm font-semibold">
            {progress}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-center text-4xl font-bold text-night">{question.prompt}</p>
          
          {showVisual && questionParts && (
            <div className="mt-4">
              <MultiplicationVisual 
                a={parseInt(questionParts[0])} 
                b={parseInt(questionParts[1])} 
              />
            </div>
          )}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {question.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              className={`rounded-xl border px-4 py-3 text-lg font-semibold transition ${
                feedback && choice === question.answer && feedback === "correct"
                  ? "border-mint bg-mint/40"
                  : "border-slate-200 hover:border-night/30"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
        {feedback && (
          <p
            className={`mt-4 text-center font-semibold ${
              feedback === "correct" ? "text-emerald-700" : "text-coral-700"
            }`}
          >
            {feedback === "correct" ? t("exercise.correct") : t("exercise.incorrect")}
          </p>
        )}
      </div>

      {finished && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-night">{t("exercise.summary")}</h2>
          <p className="mt-2 text-night/70">
            {t("exercise.score")}: {score}/{ROUND_LENGTH}
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate(0)}
              className="rounded-full bg-night px-4 py-2 text-white font-semibold"
            >
              {t("exercise.retry")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-full bg-white px-4 py-2 font-semibold border border-slate-200"
            >
              {t("exercise.home")}
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
