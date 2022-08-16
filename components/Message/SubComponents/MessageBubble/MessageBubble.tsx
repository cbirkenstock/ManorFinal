import React, { useRef } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Message } from "../../../../src/models";
import useAppContext from "../../../../hooks/useAppContext";
import { styles } from "./styles";

interface MessageBubbleProps {
  message: Message;
  style?: StyleProp<ViewStyle>;
}

export default function MessageBubble(props: MessageBubbleProps) {
  const { message, style } = props;
  const { chatUser } = useAppContext();
  const isMe = message?.chatuserID === chatUser?.id;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View
      style={[
        styles.messageBubble,
        isMe ? styles.bubbleOutgoing : styles.bubbleIncoming,
        style,
      ]}
    >
      <Text style={styles.textMessageFont}>{message?.messageBody}</Text>
    </View>
  );
}
