import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";
import { Message } from "../../src/models";
import styles from "./styles";
import IconButton from "../IconButton/IconButton";
import MediaMessage from "../Message/SubComponents/MediaMessage";
import MessageBubble from "../Message/SubComponents/MessageBubble";
import Colors from "../../constants/Colors";

interface ReplyToMessageSectionProps {
  messageToReplyTo: Message;
  setMessageToReplyTo: React.Dispatch<
    React.SetStateAction<Message | undefined>
  >;
}

export default function ReplyToMessageSection(
  props: ReplyToMessageSectionProps
) {
  const { messageToReplyTo, setMessageToReplyTo } = props;

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.helperText}>Reply To Message</Text>
        {messageToReplyTo?.imageUrl ? (
          <MediaMessage message={messageToReplyTo} style={styles.message} />
        ) : (
          <MessageBubble message={messageToReplyTo} style={styles.message} />
        )}
      </View>
      <IconButton
        icon={
          <AntDesign name="closecircleo" size={24} color={Colors.manorPurple} />
        }
        padding={0}
        color={"transparent"}
        onPress={() => {
          setMessageToReplyTo(undefined);
        }}
      />
    </View>
  );
}
