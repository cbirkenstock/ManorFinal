import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: Colors.manorBlueGray,
    paddingHorizontal: 10,
    paddingVertical: 15,
    height: 55,
  },

  text: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});
