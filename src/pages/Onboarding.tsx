import { Link } from "react-router-dom";

const steps = [
  { title: "Earn coins", body: "Solve questions to win points and coins." },
  { title: "Decorate your room", body: "Spend coins to buy furniture and posters." },
  { title: "Pick your skill", body: "Addition, subtraction, multiplication, division." },
  { title: "Stay on a streak", body: "Practice daily to unlock bonuses." }
];

export default function Onboarding() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-night">How it works</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-lg font-bold text-night">{step.title}</p>
            <p className="text-sm text-night/70">{step.body}</p>
          </div>
        ))}
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-night px-5 py-3 text-white font-semibold shadow hover:bg-night/90"
      >
        Begin adventure →
      </Link>
    </div>
  );
}
