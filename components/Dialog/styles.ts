import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  exitView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
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
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },

  helperText: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 10,
    color: "white",
  },
});
