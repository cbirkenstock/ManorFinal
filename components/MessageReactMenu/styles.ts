import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.manorBlueGray,
    borderRadius: 25,
    width: 95,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
