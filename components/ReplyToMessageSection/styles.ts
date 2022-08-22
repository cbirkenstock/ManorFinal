import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Colors.manorDarkWhite,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  messageContainer: { flex: 1, maxWidth: "90%" },

  helperText: {
    color: Colors.manorDarkWhite,
  },

  message: { alignSelf: "flex-start", marginTop: 5 },
});

export default styles;
