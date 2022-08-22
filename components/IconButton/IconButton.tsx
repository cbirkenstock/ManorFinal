import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface IconButtonProps {
  style?: StyleProp<ViewStyle>;
  icon: React.ReactNode;
  padding: number;
  color: string;
  onPress: () => void;
}

export default function IconButton(props: IconButtonProps) {
  const { style, icon, padding, color, onPress } = props;
  return (
    <TouchableOpacity
      style={[
        {
          padding: padding,
          borderRadius: 30,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon}
    </TouchableOpacity>
  );
}
