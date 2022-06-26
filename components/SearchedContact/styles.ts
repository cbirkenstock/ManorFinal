import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 20,
    width: `${(1 / 3) * 100}%`,
  },

  contactImageContainer: {
    width: Dimensions.get("window").width / 3 - 30,
    height: Dimensions.get("window").width / 3 - 30,
  },

  contactImage: {
    flex: 1,
    borderRadius: Dimensions.get("window").width / 3,
  },

  contactNameText: {
    marginHorizontal: 4,
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
