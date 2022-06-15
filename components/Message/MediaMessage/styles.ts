import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";

export const styles = StyleSheet.create({
  imageBackground: {
    backgroundColor: Colors.manorBackgroundGray,
    borderRadius: 15,
    overflow: "hidden",
  },
  imageOutgoing: {
    alignSelf: "flex-end",
    marginRight: 5,
  },

  imageIncoming: {
    alignSelf: "flex-start",
    marginLeft: 40,
  },
});
