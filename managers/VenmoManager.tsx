import { Alert, Linking } from "react-native";
import { ChatUser, User } from "../src/models";

export const getVenmoHandle = (chatUser?: ChatUser) => {
  if (chatUser) {
    return chatUser.user.venmoHandle;
  }
};

export const containsVenmo = (message: string) => {
  if (message.includes("Venmo") || message.includes("venmo")) {
    return true;
  } else {
    return false;
  }
};

export const extractVenmoAmount = (messageBody: string) => {
  return messageBody.match(/\d/g)?.join("");
};

export const goToVenmo = (venmoHandle: string, amount: string) => {
  Linking.openURL(
    `venmo://paycharge?txn=pay&recipients=${venmoHandle}&amount=${amount}&note=Thanks!`
  );
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
