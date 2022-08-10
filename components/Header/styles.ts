import { StyleSheet } from "react-native";
import { hasBezels } from "../../constants/hasBezels";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginLeft: "5%",
    marginTop: hasBezels ? "1%" : "12%",
    marginBottom: "2%",
    marginRight: "5%",
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
