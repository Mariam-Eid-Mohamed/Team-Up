import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { migrateOldSessionIfNeeded } from "./store/migrateSession";
import "./index.css";
import App from "./App.tsx";
migrateOldSessionIfNeeded();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
