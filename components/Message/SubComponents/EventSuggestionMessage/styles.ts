import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: 0.56 * width,
    alignSelf: "center",
  },

  linearGradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    borderRadius: 20,
  },

  monthText: {
    color: "white",
    fontSize: 45,
  },

  dayText: {
    color: "black",
    fontSize: 120,
    fontWeight: "600",
    textAlign: "center",
  },

  timeText: {
    color: "white",
    fontSize: 30,
    fontWeight: "400",
    textAlign: "center",
  },
});
