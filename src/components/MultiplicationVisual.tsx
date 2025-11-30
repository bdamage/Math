import { useMemo } from "react";

type MultiplicationVisualProps = {
  a: number;
  b: number;
};

export default function MultiplicationVisual({ a, b }: MultiplicationVisualProps) {
  const dots = useMemo(() => {
    const result = [];
    for (let row = 0; row < Math.min(a, 10); row++) {
      for (let col = 0; col < Math.min(b, 10); col++) {
        result.push({ row, col });
      }
    }
    return result;
  }, [a, b]);

  // Don't show if numbers are too large
  if (a > 10 || b > 10) return null;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-sky-50 rounded-lg">
      <p className="text-xs text-night/60 font-semibold">
        {a} groups of {b}
      </p>
      <div 
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${b}, 1fr)`
        }}
      >
        {dots.map((dot, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full bg-ocean animate-[bounce_0.5s_ease-in-out]"
            style={{
              animationDelay: `${dot.row * 50 + dot.col * 50}ms`,
              animationIterationCount: 1
            }}
          />
        ))}
      </div>
      <p className="text-sm text-night/80 font-semibold mt-2">
        = {a * b}
      </p>
    </div>
  );
}
