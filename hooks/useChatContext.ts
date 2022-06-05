import { useContext } from "react";
import { AppContext } from "../navigation/Providers/AppProvider";

export const useChatContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useShop must be used within ShopContext");
  }

  return context;
};

export default useChatContext;
