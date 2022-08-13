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
    alignSelf: "flex-end",
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
});
