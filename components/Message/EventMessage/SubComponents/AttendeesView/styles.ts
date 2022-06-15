import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  attendeeFlatList: {
    paddingHorizontal: "1%",
    alignSelf: "center",
    width: 0.9 * width,
    marginBottom: 0,
  },

  contactNameText: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 2,
  },
});
