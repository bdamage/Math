import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RouterError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const status = isRouteErrorResponse(error) ? error.status : undefined;
  const detail = isRouteErrorResponse(error) ? error.statusText : (error as Error)?.message;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-mint/20 flex items-center justify-center px-4">
      <div className="max-w-lg rounded-2xl bg-white p-8 shadow-lg border border-slate-200 space-y-3 text-center">
        <p className="text-sm font-semibold text-coral/80">{status ?? "Error"}</p>
        <h1 className="text-2xl font-bold text-night">{t("error.title")}</h1>
        <p className="text-night/70">{t("error.message")}</p>
        {detail && <p className="text-xs text-night/50">Details: {detail}</p>}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => navigate(0)}
            className="rounded-full bg-night px-4 py-2 text-white font-semibold hover:bg-night/90"
          >
            {t("error.retry")}
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-white px-4 py-2 font-semibold border border-slate-200 hover:border-night/40"
          >
            {t("error.home")}
          </button>
        </div>
      </div>
    </div>
  );
}
