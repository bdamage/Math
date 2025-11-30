import { createBrowserRouter } from "react-router-dom";
import AppShell from "./AppShell";
import RouterError from "./RouterError";
import Dashboard from "../pages/Dashboard";
import SkillSelect from "../pages/SkillSelect";
import Exercise from "../pages/Exercise";
import MultiplicationTrainer from "../pages/MultiplicationTrainer";
import RoomShop from "../pages/RoomShop";
import ProgressPage from "../pages/Progress";
import SettingsPage from "../pages/Settings";
import Onboarding from "../pages/Onboarding";
import { ProgressProvider } from "../state/useProgress";

const withProviders = (node: React.ReactNode) => <ProgressProvider>{node}</ProgressProvider>;

const router = createBrowserRouter([
  {
    path: "/",
    element: withProviders(<AppShell />),
    errorElement: withProviders(<RouterError />),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "practice", element: <SkillSelect /> },
      { path: "exercise", element: <Exercise /> },
      { path: "trainer", element: <MultiplicationTrainer /> },
      { path: "room", element: <RoomShop /> },
      { path: "progress", element: <ProgressPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "onboarding", element: <Onboarding /> }
    ]
  }
]);

export default router;
