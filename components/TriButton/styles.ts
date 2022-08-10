import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 30,
  },

  button: {
    width: "90%",
    borderRadius: 20,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5C6AEF",
  },

  buttonText: {
    fontSize: 27,
    color: "white",
  },

  smallButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
    marginTop: 10,
    paddingHorizontal: 10,
  },

  smallButtonText: {
    color: "#5C6AEF",
    fontSize: 15,
  },
});
