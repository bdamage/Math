import { Skill } from "../state/questionGenerator";

type HintProps = {
  skill: Skill;
  a: number;
  b: number;
  answer: number;
};

export default function Hint({ skill, a, b, answer }: HintProps) {
  const renderMultiplicationHint = () => {
    if (a > 12 || b > 12) {
      return (
        <div className="text-sm text-night/70">
          <p className="font-semibold">💡 Tip:</p>
          <p>Break it down: {a} × {b} = {a} groups of {b}</p>
        </div>
      );
    }

    return (
      <div className="text-sm text-night/70">
        <p className="font-semibold mb-2">💡 Think of it as groups:</p>
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: Math.min(a, 5) }, (_, i) => (
            <div key={i} className="flex gap-1">
              {Array.from({ length: Math.min(b, 5) }, (_, j) => (
                <div key={j} className="w-2 h-2 rounded-full bg-ocean/60" />
              ))}
            </div>
          ))}
          {(a > 5 || b > 5) && <span className="text-xs">...</span>}
        </div>
        <p className="mt-2">{a} groups of {b} = ?</p>
      </div>
    );
  };

  const renderAdditionHint = () => {
    return (
      <div className="text-sm text-night/70">
        <p className="font-semibold">💡 Counting up:</p>
        <p>Start at {a} and count up {b} more</p>
        <div className="mt-2 flex gap-1 flex-wrap">
          {Array.from({ length: Math.min(10, a) }, (_, i) => (
            <div key={`a-${i}`} className="w-2 h-2 rounded-full bg-mint" />
          ))}
          <span className="mx-1">+</span>
          {Array.from({ length: Math.min(10, b) }, (_, i) => (
            <div key={`b-${i}`} className="w-2 h-2 rounded-full bg-sunshine" />
          ))}
        </div>
      </div>
    );
  };

  const renderSubtractionHint = () => {
    return (
      <div className="text-sm text-night/70">
        <p className="font-semibold">💡 Taking away:</p>
        <p>Start with {a} and take away {b}</p>
        <p className="mt-1 text-xs">Or think: {b} + ? = {a}</p>
      </div>
    );
  };

  const renderDivisionHint = () => {
    if (b === 0) {
      return (
        <div className="text-sm text-night/70">
          <p className="font-semibold">⚠️ Cannot divide by zero!</p>
        </div>
      );
    }

    return (
      <div className="text-sm text-night/70">
        <p className="font-semibold">💡 Sharing equally:</p>
        <p>Split {a} into groups of {b}</p>
        <p className="mt-1 text-xs">Or think: {b} × ? = {a}</p>
      </div>
    );
  };

  return (
    <div className="mt-3 p-3 bg-sky-50 rounded-lg border border-sky-200 animate-[fadeIn_0.3s_ease-in]">
      {skill === "multiplication" && renderMultiplicationHint()}
      {skill === "addition" && renderAdditionHint()}
      {skill === "subtraction" && renderSubtractionHint()}
      {skill === "division" && renderDivisionHint()}
    </div>
  );
}
