import "react-native-gesture-handler";
import React from "react";
import { Text, Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import "react-native-get-random-values";
import { PressableProps } from "react-native";
import { styles } from "./styles";

export interface SectionButtonProps extends Omit<PressableProps, "style"> {
  caption: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function SectionButton(props: SectionButtonProps) {
  const {
    caption,
    startAdornment,
    endAdornment,
    buttonStyle,
    textStyle,
    ...rest
  } = props;

  return (
    <Pressable style={[styles.container, buttonStyle]} {...rest}>
      {startAdornment}
      <Text style={[styles.text, textStyle]}>{caption}</Text>
      {endAdornment}
    </Pressable>
  );
}
