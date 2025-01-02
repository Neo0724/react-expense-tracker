import { ToastContext } from "./ToastContextProvider";

import { useContext } from "react";

export const useToastContext = () => useContext(ToastContext);
