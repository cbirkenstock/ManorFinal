import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  exitView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.manorBackgroundGray,
    borderRadius: 20,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    maxHeight: 420,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "left",
    color: "white",
    marginBottom: 7.5,
  },

  helperText: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "left",
    marginBottom: 10,
    color: "white",
  },
});
