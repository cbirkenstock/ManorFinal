import React, { useRef } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Message } from "../../../../src/models";
import useAppContext from "../../../../hooks/useAppContext";
import { styles } from "./styles";
import {
  containsVenmo,
  extractVenmoAmount,
  getVenmoHandle,
} from "../../../../managers/VenmoManager";

interface MessageBubbleProps {
  message: Message;
  isValidVenmoRequest?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function MessageBubble(props: MessageBubbleProps) {
  const { message, isValidVenmoRequest = false, style } = props;
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
        isValidVenmoRequest ? styles.venmo : null,
        style,
      ]}
    >
      <Text style={styles.textMessageFont}>{message?.messageBody}</Text>
    </View>
  );
}

export const MemoMessage = React.memo(MessageBubble, () => {
  return true;
});
