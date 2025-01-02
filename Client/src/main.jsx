import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GlobalContextProvider } from "./Context/GlobalContextProvider.jsx";
import { ToastContextProvider } from "./Context/ToastContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalContextProvider>
      <ToastContextProvider>
        <App />
      </ToastContextProvider>
    </GlobalContextProvider>
  </React.StrictMode>
);
