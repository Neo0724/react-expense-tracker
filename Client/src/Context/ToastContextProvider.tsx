import React, { useEffect, useRef, useState } from "react";
import { ToastContextType } from "../types/ToastContext";

export const ToastContext = React.createContext({} as ToastContextType);

export const ToastContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showToast, setShowToast] = useState(false);
  const [content, setContent] = useState({ title: "", description: "" });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = (title: string, description: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setContent({ title, description });
    setShowToast(true);

    timerRef.current = setTimeout(() => {
      setShowToast(false);
      setContent({ title: "", description: "" });
      timerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {
        <div className={`toast ${showToast ? "showToast" : "hideToast"}`}>
          <span className="toastTitle">{content.title}</span>
          <span className="toastDescription">{content.description}</span>
        </div>
      }
    </ToastContext.Provider>
  );
};
