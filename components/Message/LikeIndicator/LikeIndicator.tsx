import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import useAppContext from "../../../hooks/useAppContext";
import { Message } from "../../../src/models";
import { styles } from "./styles";

interface LikesProps {
  message: Message;
}

const OutgoingLikeCountAndHeart = (props: LikesProps) => {
  const { chatUser } = useAppContext();
  const { message } = props;
  const isMe = message.chatuserID === chatUser?.id;

  return (
    <View
      style={{
        marginRight: isMe ? 10 : 0,
        marginLeft: isMe ? 0 : 10,
      }}
    >
      {!isMe && (
        <AntDesign name="hearto" size={32} color={Colors.manorPurple} />
      )}
      <Text style={styles.likeText}>{message.likes}</Text>
      {isMe && <AntDesign name="hearto" size={32} color={Colors.manorPurple} />}
    </View>
  );
};
