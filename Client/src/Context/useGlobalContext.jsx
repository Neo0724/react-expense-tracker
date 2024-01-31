import { GlobalContext } from "./GlobalContextProvider";

import { useContext } from "react";

export const useGlobalContext = () => useContext(GlobalContext);
