import React, { useState } from "react";

export const ToastContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
export const ToastContextProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [content, setContent] = useState({ title: "", description: "" });

  const toast = (title, description) => {
    setContent({ title, description });
    setShowToast(true);
    const toastTimeout = setTimeout(() => {
      setShowToast(false); // Hide toast after 3 seconds
      setContent({ title: "", description: "" });
    }, 3000);

    // Clear the timeout if component unmounts
    return () => clearTimeout(toastTimeout);
  };

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
