import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GlobalContextProvider } from "./Context/GlobalContextProvider.jsx";
import { ToastContextProvider } from "./Context/ToastContextProvider.jsx";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <GlobalContextProvider>
        <ToastContextProvider>
          <App />
        </ToastContextProvider>
      </GlobalContextProvider>
    </CookiesProvider>
  </React.StrictMode>
);
