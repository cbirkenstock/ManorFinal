import "react-native-gesture-handler";
import React from "react";
import {
  Text,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
  View,
} from "react-native";
import "react-native-get-random-values";
import { PressableProps } from "react-native";
import { styles } from "./styles";
import Colors from "../../constants/Colors";

export interface SectionButtonProps extends Omit<PressableProps, "style"> {
  caption: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  first?: boolean;
  multiline?: boolean;
  dictionaryInput?: React.ReactNode;
}

export default function SectionButton(props: SectionButtonProps) {
  const {
    caption,
    startAdornment,
    endAdornment,
    buttonStyle,
    textStyle,
    first,
    multiline,
    dictionaryInput,
    ...rest
  } = props;

  return (
    <Pressable
      style={[
        styles.container,
        { marginTop: first ? 0 : 5, height: multiline ? undefined : 50 },
        buttonStyle,
      ]}
      {...rest}
    >
      {startAdornment}
      <Text numberOfLines={3}>
        {dictionaryInput}
        <Text style={[styles.text, textStyle]}>{caption}</Text>
      </Text>
      {endAdornment}
    </Pressable>
  );
}
