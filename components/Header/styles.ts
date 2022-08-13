import { StyleSheet } from "react-native";
import { hasBezels } from "../../constants/hasBezels";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",

    flex: 1,
  },
  titleText: {
    fontSize: 33,
    color: "white",
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "20%",
    justifyContent: "space-between",
  },
});
