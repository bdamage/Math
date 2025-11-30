import { useTranslation } from "react-i18next";
import { useProgress } from "../state/useProgress";

const SHOP_ITEMS = [
  { id: "lamp", name: "Cozy Lamp", cost: 50 },
  { id: "plant", name: "Green Plant", cost: 40 },
  { id: "poster", name: "Math Poster", cost: 60 }
];

export default function RoomShop() {
  const { t } = useTranslation();
  const { progress, unlockItem, addPoints } = useProgress();

  const handleBuy = (id: string, cost: number) => {
    if (progress.coins < cost) return;
    addPoints(-cost);
    unlockItem(id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-gradient-to-br from-sky-200 to-mint-200 p-6 shadow-sm lg:col-span-2">
        <p className="text-sm font-semibold text-night/70">{t("room.title")}</p>
        <div className="mt-4 h-64 rounded-xl border border-white/60 bg-white/70 p-4 shadow-inner">
          <p className="text-night/70">Room preview</p>
          <div className="mt-2 flex gap-2">
            {progress.room.ownedItems.map((item) => (
              <span
                key={item}
                className="rounded-lg bg-white/90 px-3 py-2 text-sm font-semibold text-night shadow"
              >
                {item}
              </span>
            ))}
            {progress.room.ownedItems.length === 0 && (
              <span className="text-night/60">Buy an item to see it here</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-night">{t("room.shop")}</h2>
        {SHOP_ITEMS.map((item) => {
          const owned = progress.room.ownedItems.includes(item.id);
          const canAfford = progress.coins >= item.cost;
          return (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-night">{item.name}</p>
                <p className="text-sm text-night/60">{item.cost} {t("nav.coins")}</p>
              </div>
              <button
                disabled={owned || !canAfford}
                onClick={() => handleBuy(item.id, item.cost)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  owned
                    ? "bg-slate-100 text-night/50"
                    : canAfford
                    ? "bg-ocean text-white hover:bg-ocean/90"
                    : "bg-slate-100 text-night/50"
                }`}
              >
                {owned ? "Owned" : canAfford ? t("room.buy") : t("room.notEnough")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
