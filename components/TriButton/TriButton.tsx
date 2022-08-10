import React from "react";
import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
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
  isLoading: boolean;
}

export default function TriButton(props: Tributton) {
  const { mainButton, bottomLeftButton, bottomRightButton, isLoading } = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { marginTop: mainButton.title === "Log In" ? 40 : 0 },
        ]}
        onPress={mainButton.onPress}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>{mainButton.title}</Text>
        )}
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
