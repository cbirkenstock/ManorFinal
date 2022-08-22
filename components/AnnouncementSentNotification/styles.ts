import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  background: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    paddingTop: "40%",
  },

  container: {
    backgroundColor: Colors.manorBlueGray,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 25,
    height: 200,
    width: 200,
    borderRadius: 30,
  },

  text: {
    color: Colors.manorGreen,
    fontWeight: "600",
    fontSize: 60,
  },
});

export default styles;
