import { Alert, AlertButton } from "react-native";

export const createAlert = (
  title: string,
  alertButtons: AlertButton[],
  helperText?: string
) => {
  Alert.alert(title, helperText, alertButtons);
};
