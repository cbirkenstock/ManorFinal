import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    margin: 1,
    alignSelf: "flex-start",
  },

  newMessageView: {
    marginTop: 5,
    width: Dimensions.get("window").width / 2 - 30,
    height: Dimensions.get("window").width / 2 - 30,
    borderRadius: (Dimensions.get("window").width / 2 - 15) / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 9,
  },

  contactImage: {
    backgroundColor: Colors.manorBlueGray,
    width: Dimensions.get("window").width / 2 - 38,
    height: Dimensions.get("window").width / 2 - 38,
    borderRadius: (Dimensions.get("window").width / 2 - 23) / 2,
  },

  contactNameText: {
    marginTop: 5,
    marginHorizontal: 2,
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  messagePreviewText: {
    color: Colors.manorDarkWhite,
    fontSize: 18,
    marginHorizontal: 3,
  },
});

export default styles;
