import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  ChatInfoButton: {
    height: 60,
    width: 60,
    backgroundColor: Colors.manorBlueGray,
    borderRadius: 50,
    justifyContent: "center",
    shadowColor: "#423f3f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 5,
    overflow: "hidden",
  },
  chatFlatlistButtons: {
    position: "absolute",
    top: "5%",
    right: "2.5%",
    alignItems: "center",
  },
});

export default styles;
