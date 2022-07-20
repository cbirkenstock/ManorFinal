import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: Colors.manorBlueGray,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  text: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
  },
});
