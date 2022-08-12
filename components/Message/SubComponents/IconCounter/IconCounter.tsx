import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import Colors from "../../../../constants/Colors";
import { styles } from "./styles";

interface LikesProps {
  count: number;
  side: "left" | "right";
  icon: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function IconCounter(props: LikesProps) {
  const { count: likes, side, icon, style } = props;
  return (
    <View style={[style, { flexDirection: "row" }]}>
      {side === "left" && icon}
      <Text
        style={{
          color: "white",
          marginLeft: side === "left" ? 3 : 0,
          marginRight: side === "right" ? 3 : 0,
          fontSize: 20,
          fontWeight: "500",
        }}
      >
        {likes ?? 1}
      </Text>
      {side === "right" && icon}
    </View>
  );
}
