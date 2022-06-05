import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "./styles";

interface Tributton {
  mainButton: {
    title: string;
    onPress: () => void;
  };
  bottomLeftButton: {
    title: string;
    onPress: () => void;
  };
  bottomRightButton: {
    title: string;
    onPress: () => void;
  };
}

export default function TriButton(props: Tributton) {
  const { mainButton, bottomLeftButton, bottomRightButton } = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { marginTop: mainButton.title === "Log In" ? 40 : 0 },
        ]}
        onPress={mainButton.onPress}
      >
        <Text style={styles.buttonText}>{mainButton.title}</Text>
      </TouchableOpacity>
      <View style={styles.smallButtonContainer}>
        <TouchableOpacity onPress={bottomLeftButton.onPress}>
          <Text style={styles.smallButtonText}>{bottomLeftButton.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={bottomRightButton.onPress}>
          <Text style={styles.smallButtonText}>{bottomRightButton.title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
