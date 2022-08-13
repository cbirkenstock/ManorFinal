import React, { useRef } from "react";
import { Text, View } from "react-native";
import { Message } from "../../../../src/models";
import useAppContext from "../../../../hooks/useAppContext";
import { styles } from "./styles";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble(props: MessageBubbleProps) {
  const { message } = props;
  const { chatUser } = useAppContext();
  const isMe = message.chatuserID === chatUser?.id;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <View
      style={[
        styles.messageBubble,
        isMe ? styles.bubbleOutgoing : styles.bubbleIncoming,
      ]}
    >
      <Text style={styles.textMessageFont}>{message.messageBody}</Text>
    </View>
  );
}
