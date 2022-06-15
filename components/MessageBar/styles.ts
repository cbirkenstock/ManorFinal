import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 37.5,
    marginBottom: 47.5,
    width: "100%",
    paddingHorizontal: "1%",
  },

  messageBar: {
    minHeight: 37.5,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 37.5 / 2,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "white",
    flex: 1,
    paddingTop: 7.5,
  },

  TouchableOpacity: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
});
