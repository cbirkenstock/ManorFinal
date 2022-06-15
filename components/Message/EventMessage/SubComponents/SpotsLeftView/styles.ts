import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  spotsLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 0.9 * width,
  },

  spotCountText: {
    fontSize: 19,
    fontWeight: "800",
  },

  fillerText: {
    color: "white",
    fontSize: 17,
    marginLeft: 5,
    fontWeight: "500",
  },
});
