import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";
import Colors from "../../../../constants/Colors";
import useAppContext from "../../../../hooks/useAppContext";
import { Message } from "../../../../src/models";
import { styles } from "./styles";

interface LikesProps {
  messageLikes: number;
  isMe: boolean;
}

export default function LikeIndicator(props: LikesProps) {
  const { chatUser } = useAppContext();
  const { messageLikes, isMe } = props;

  return (
    <View
      style={{
        flexDirection: "row",
        marginRight: isMe ? 10 : 0,
        marginLeft: isMe ? 0 : 10,
      }}
    >
      {!isMe && (
        <AntDesign name="hearto" size={32} color={Colors.manorPurple} />
      )}
      <Text style={styles.likeText}>{messageLikes ?? 1}</Text>
      {isMe && <AntDesign name="hearto" size={32} color={Colors.manorPurple} />}
    </View>
  );
}
