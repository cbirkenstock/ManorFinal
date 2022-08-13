import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { styles } from "./styles";

interface HeaderProps {
  title: string;
  buttons?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Header(props: HeaderProps) {
  const { title, buttons, style } = props;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.buttonContainer}>{buttons}</View>
    </View>
  );
}
