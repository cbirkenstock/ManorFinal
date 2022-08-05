import { DataStore } from "aws-amplify";
import React, { useState } from "react";
import { View, Pressable, Text, TextInput, StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";
import useAppContext from "../../../../hooks/useAppContext";
import useAuthContext from "../../../../hooks/useAuthContext";
import {
  checkForPreExistingDMChat,
  createDMChat,
} from "../../../../managers/ChatManager";
import {
  updateLastMessage,
  uploadMessage,
} from "../../../../managers/MessageManager";
import { Chat, ChatUser, Message, User } from "../../../../src/models";
import FormCompletionButton from "../../../FormCompletionButton";

interface MessageAllFormProps {
  unreachedUsers: User[];
  onSubmit?: () => any;
}

export default function MessageAllForm(props: MessageAllFormProps) {
  const { unreachedUsers, onSubmit } = props;
  const { user } = useAuthContext();
  const [messageToAll, setMessageToAll] = useState<string>();

  /* -------------------------------------------------------------------------- */
  /*                         Fetch All Unreached Members                        */
  /* -------------------------------------------------------------------------- */

  const messageAllUnreached = async () => {
    if (user) {
      for (const unreachedUser of unreachedUsers) {
        var DMChat = await checkForPreExistingDMChat(user, unreachedUser);

        if (!DMChat) {
          const results = await createDMChat(user, unreachedUser);

          if (!results) {
            return;
          }

          DMChat = results.chat;
        }

        const DMChatUser = (
          await DataStore.query(ChatUser, (chatUser) =>
            chatUser.chatID("eq", DMChat.id).userID("eq", user?.id ?? "")
          )
        )[0];

        const newMessage = new Message({
          messageBody: messageToAll,
          chatuserID: DMChatUser?.id,
          chatID: DMChat.id,
        });

        uploadMessage(newMessage);

        DataStore.save(
          Chat.copyOf(DMChat, (updatedChat) => {
            updatedChat.lastMessage = messageToAll;
          })
        );

        setMessageToAll("");
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <TextInput
        style={styles.messageInput}
        keyboardAppearance="dark"
        autoFocus={true}
        placeholder={"Message"}
        placeholderTextColor={Colors.manorDarkWhite}
        onChangeText={(value) => {
          setMessageToAll(value);
        }}
        value={messageToAll ?? ""}
        multiline={true}
      />
      <FormCompletionButton
        text="Send Message"
        onPress={() => {
          if (messageToAll) {
            messageAllUnreached();
            onSubmit?.();
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  messageInput: {
    fontSize: 18,
    color: "white",
    borderWidth: 2,
    borderColor: Colors.manorPurple,
    borderRadius: 10,
    height: 80,
    padding: 7.5,
  },
});
