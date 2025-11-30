import { useProgress } from "../state/useProgress";
import { useTranslation } from "react-i18next";

export default function NavStats() {
  const { t } = useTranslation();
  const { progress } = useProgress();

  return (
    <div className="flex items-center gap-3 text-xs text-night">
      <StatPill label={t("nav.points")} value={progress.points} color="bg-sunshine/40" />
      <StatPill label={t("nav.coins")} value={progress.coins} color="bg-mint/60" />
      <StatPill label={t("nav.streak")} value={progress.streakDays} color="bg-coral/40" />
    </div>
  );
}

function StatPill({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <span className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${color}`}>
      <span className="text-night/70">{label}</span>
      <span className="text-night">{value}</span>
    </span>
  );
}
