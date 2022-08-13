import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  messageBubble: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 15,
  },

  bubbleOutgoing: {
    backgroundColor: "rgba(92, 106, 239, 0.25)",
    borderWidth: 2,
    borderColor: "rgba(92, 106, 239, 0.5)",
    alignSelf: "flex-end",
  },

  bubbleIncoming: {
    backgroundColor: "rgba(82, 82, 82, 0.25)",
    borderWidth: 2,
    borderColor: "rgba(82, 82, 82, 0.5)",
    alignSelf: "flex-start",
  },

  popularMessage: {
    shadowColor: "#fcba03",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
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
