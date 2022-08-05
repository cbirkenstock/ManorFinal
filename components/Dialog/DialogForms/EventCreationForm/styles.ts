import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

export const styles = StyleSheet.create({
  titleContainer: { marginTop: 0 },
  dateContainer: { paddingVertical: 5 },
  rowButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  toggleButtonContainer: { height: 50, width: "49%" },
  descriptionView: {
    borderWidth: 2,
    borderColor: Colors.manorPurple,
    borderRadius: 10,
    height: 80,
  },

  descriptionTextInput: {
    flex: 1,
    fontSize: 18,
    color: "white",
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  createEventButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.manorPurple,
  },

  createEventButtonText: {
    color: "white",
    fontSize: 23,
    fontWeight: "600",
  },
});
