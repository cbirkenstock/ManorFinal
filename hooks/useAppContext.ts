import { useContext } from "react";
import { AppContext } from "../navigation/Providers/AppProvider";

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within AppContext");
  }

  return context;
};

export default useAppContext;
