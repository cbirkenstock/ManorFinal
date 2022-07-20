import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: Colors.manorBlueGray,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },

  input: {
    color: "white",
    fontSize: 18,
  },
});
