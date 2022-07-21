import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "5%",
    width: "95%",
    alignSelf: "center",
    backgroundColor: Colors.manorPurple,
    zIndex: 1000,
    borderRadius: 15,
    padding: 10,
  },

  topRow: {
    flexDirection: "row",
  },

  contactImage: {
    backgroundColor: "black",
    height: 50,
    width: 50,
    borderRadius: 25,
  },

  textWrapper: {
    flex: 1,
    paddingLeft: 10,

    justifyContent: "center",
  },

  announcementBody: { color: "white", fontSize: 18 },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end",

    paddingTop: 10,
  },

  button: { backgroundColor: "white", padding: 10, borderRadius: 10 },

  buttonText: { fontSize: 16 },
});

export default styles;
