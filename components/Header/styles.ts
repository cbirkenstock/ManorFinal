import { StyleSheet } from "react-native";
import { hasBezels } from "../../constants/hasBezels";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
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
