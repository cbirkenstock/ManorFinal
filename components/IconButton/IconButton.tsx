import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface IconButtonProps {
  style?: StyleProp<ViewStyle>;
  icon: React.ReactNode;
  dimension: number;
  color: string;
  onPress: () => void;
}

export default function IconButton(props: IconButtonProps) {
  const { style, icon, dimension, color, onPress } = props;
  return (
    <TouchableOpacity
      style={[
        {
          height: dimension,
          width: dimension,
          borderRadius: dimension,
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
