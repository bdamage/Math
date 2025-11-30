import { useEffect, useState } from "react";

type ConfettiProps = {
  show: boolean;
};

export default function Confetti({ show }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ["bg-ocean", "bg-coral", "bg-mint", "bg-sunshine"];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-3 h-3 ${particle.color} rounded-sm animate-[confetti_2s_ease-out_forwards]`}
          style={{
            left: `${particle.x}%`,
            top: "-5%",
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
}
