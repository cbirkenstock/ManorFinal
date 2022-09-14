import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  contactImageContainer: {
    height: 30,
    width: 30,
    marginRight: 5,

    alignSelf: "flex-start",
  },

  iconCounterContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.manorChatScreenBlack,
    marginTop: -5,
  },

  popularMessage: {
    shadowColor: "#fcba03",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 5,
    elevation: 5,
  },

  messageActivated: {
    shadowColor: Colors.manorPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});
