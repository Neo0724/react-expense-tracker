import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// @ts-expect-error CSS is loaded by the bundler and has no TypeScript module declaration.
import "./index.css";
import { GlobalContextProvider } from "./Context/GlobalContextProvider.tsx";
import { ToastContextProvider } from "./Context/ToastContextProvider.tsx";
import { AuthContextProvider } from "./Context/AuthContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <GlobalContextProvider>
        <ToastContextProvider>
          <App />
        </ToastContextProvider>
      </GlobalContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
