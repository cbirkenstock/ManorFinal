import React, { useEffect, useRef } from "react";
import { Text, Pressable, Animated, View } from "react-native";
import { Message } from "../../../src/models";
import useAppContext from "../../../hooks/useAppContext";
import { styles } from "./styles";
import { animate } from "../../../managers/AnimationManager";

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
    <Pressable
      style={[
        styles.messageBubble,
        isMe ? styles.bubbleOutgoing : styles.bubbleIncoming,
        { marginTop: message.marginTop },
      ]}
    >
      <Text style={styles.textMessageFont}>{message.messageBody}</Text>
    </Pressable>
  );
}
