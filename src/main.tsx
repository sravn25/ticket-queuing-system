import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import App from "./App.tsx";
import "./globals.css";
import { RegistrationProvider } from "./contexts/RegistrationContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RegistrationProvider>
        <App />
      </RegistrationProvider>
    </AuthProvider>
  </React.StrictMode>,
);
