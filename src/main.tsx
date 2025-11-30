import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./main.css";
import "./i18n/i18n";
import router from "./layout/routes";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
