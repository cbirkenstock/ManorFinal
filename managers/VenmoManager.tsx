import { Alert } from "react-native";

export const containsVenmo = (message: string) => {
  if (message.includes("Venmo") || message.includes("venmo")) {
    return true;
  } else {
    return false;
  }
};

export const containsAmount = (message: string) => {
  return /\d/.test(message);
};

export const noVenmoAlert = () => {
  Alert.alert(
    "No Venmo Handle",
    "If you want this to be recognized as a Venmo Message, please put your Venmo Handle into your profile settings",
    [
      {
        text: "OK",
        style: "cancel",
      },
    ]
  );
};
