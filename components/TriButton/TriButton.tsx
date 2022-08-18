import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Styles from "./styles";

interface Tributton {
  containerStyle?: StyleProp<ViewStyle>;
  mainButton: {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
  };
  bottomLeftButton: {
    title: string;
    onPress: () => void;
    style?: StyleProp<TextStyle>;
  };
  bottomRightButton: {
    title: string;
    onPress: () => void;
    style?: StyleProp<TextStyle>;
  };
  isLoading: boolean;
}

export default function TriButton(props: Tributton) {
  const {
    containerStyle,
    mainButton,
    bottomLeftButton,
    bottomRightButton,
    isLoading,
  } = props;
  const styles = Styles();

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.button, mainButton.style]}
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
          <Text style={[styles.smallButtonText, bottomLeftButton.style]}>
            {bottomLeftButton.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={bottomRightButton.onPress}>
          <Text style={[styles.smallButtonText, bottomRightButton.style]}>
            {bottomRightButton.title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
