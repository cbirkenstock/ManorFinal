import { useContext } from "react";
import { AuthContext } from "../navigation/Providers/AuthProvider";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useShop must be used within ShopContext");
  }

  return context;
};

export default useAuthContext;
