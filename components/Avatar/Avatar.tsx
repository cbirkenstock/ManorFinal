import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import Colors from "../../constants/Colors";
import { ChatUser, User } from "../../src/models";

interface AvatarProps {
  user?: User;
  chatUser?: ChatUser;
  dimensions: number | string;
  fontSize: number;
  style?: StyleProp<ViewStyle>;
}

export default function Avatar(props: AvatarProps) {
  const { user, chatUser, dimensions, fontSize, style } = props;

  let initials = user
    ? user.name
        ?.split(" ")
        ?.map((name) => name.slice(0, 1))
        ?.join("")
    : chatUser?.nickname
        ?.split(" ")
        ?.map((name) => name.slice(0, 1))
        ?.join("");

  return (
    <View
      style={[
        {
          backgroundColor: Colors.manorBlueGray,
          height: dimensions,
          width: dimensions,
          borderRadius: 1000,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text style={{ color: Colors.manorDarkWhite, fontSize: fontSize }}>
        {initials}
      </Text>
    </View>
  );
}
