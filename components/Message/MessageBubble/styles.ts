import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  messageBubble: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 15,
  },

  bubbleOutgoing: {
    backgroundColor: "rgba(92, 106, 239, 0.25)",
    borderWidth: 2,
    borderColor: "rgba(92, 106, 239, 1)",
    alignSelf: "flex-end",
  },

  bubbleIncoming: {
    backgroundColor: "rgba(82, 82, 82, 0.25)",
    borderWidth: 2,
    borderColor: "rgba(82, 82, 82, 1)",
    alignSelf: "flex-start",
  },

  venmo: {
    backgroundColor: "rgba(0, 182, 296, 0.25)",
    borderWidth: 2,
    borderColor: "rgba(0, 182, 296, 1)",
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
