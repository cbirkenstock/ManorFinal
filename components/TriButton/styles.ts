import { StyleSheet } from "react-native";

export default function Styles() {
  const styles = StyleSheet.create({
    container: {
      alignSelf: "center",
    },

    button: {
      borderRadius: 20,
      height: 60,
      backgroundColor: "#5C6AEF",
      alignItems: "center",
      justifyContent: "center",
    },

    buttonText: {
      fontSize: 27,
      color: "white",
    },

    smallButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
      paddingHorizontal: 10,
    },

    smallButtonText: {
      color: "#5C6AEF",
      fontSize: 15,
    },
  });

  return styles;
}
