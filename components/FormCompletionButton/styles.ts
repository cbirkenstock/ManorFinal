import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.manorPurple,
  },

  buttonText: {
    color: "white",
    fontSize: 23,
    fontWeight: "600",
  },
});
