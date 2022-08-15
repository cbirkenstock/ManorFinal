import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

export const styles = StyleSheet.create({
  messageBubble: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 15,
  },

  bubbleOutgoing: {
    backgroundColor: Colors.manorDarkPurple,
    borderWidth: 2,
    borderColor: "rgba(92, 106, 239, 0.5)",
    alignSelf: "flex-end",
  },

  bubbleIncoming: {
    backgroundColor: Colors.manorBlueGray,
    borderWidth: 2,
    borderColor: "#535c69",
    alignSelf: "flex-start",
  },

  venmo: {
    backgroundColor: "rgba(0, 182, 296, 0.25)",
    borderWidth: 2,
    borderColor: "rgba(0, 182, 296, 0.5)",
  },

  textMessageFont: {
    fontSize: 18,
    color: "white",
  },

  messageSenderFont: {
    fontSize: 13,
    color: "white",
  },
});
