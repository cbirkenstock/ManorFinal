import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 37.5,
    marginBottom: 47.5,
    width: "100%",
    paddingHorizontal: "1%",
  },

  messageBar: {
    minHeight: 37.5,
    backgroundColor: Colors.manorBlueGray,
    borderRadius: 37.5 / 2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 18,
    color: "white",
    flex: 1,
    paddingTop: 8.5,
  },

  TouchableOpacity: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
});
