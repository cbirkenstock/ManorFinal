import React from "react";
import { Pressable, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { styles } from "./styles";

interface ToggleButtonProps {
  toggleStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  startAdornment?: React.ReactNode;
  text: string;
  onPress: () => any;
}

export default function ToggleButton(props: ToggleButtonProps) {
  const { toggleStyle, textStyle, startAdornment, text, onPress } = props;

  return (
    <Pressable style={[styles.container, toggleStyle]} onPress={onPress}>
      {startAdornment}
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </Pressable>
  );
}
