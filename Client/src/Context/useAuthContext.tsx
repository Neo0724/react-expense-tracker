import { AuthContext } from "./AuthContextProvider";

import { useContext } from "react";

export const useAuthContext = () => useContext(AuthContext);
