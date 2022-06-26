import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: Colors.manorBlueGray,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "space-between",
  },

  text: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },

  rowBack: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#242323",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    width: "97%",
    height: 51.8,
    borderRadius: 10,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 150,
  },

  backRightBtnRight: {
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
