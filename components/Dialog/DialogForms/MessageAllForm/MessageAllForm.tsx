import { DataStore } from "aws-amplify";
import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";
import useAppContext from "../../../../hooks/useAppContext";
import useAuthContext from "../../../../hooks/useAuthContext";
import {
  checkForPreExistingDMChat,
  createDMChat,
} from "../../../../managers/ChatManager";
import { updateChatUserHasUnreadMessages } from "../../../../managers/ChatUserManager";
import { uploadMessage } from "../../../../managers/MessageManager";
import { Chat, ChatUser, Message, User } from "../../../../src/models";
import FormCompletionButton from "../../../FormCompletionButton";

interface MessageAllFormProps {
  unreachedUsers: User[];
  onSubmit?: () => any;
}

export default function MessageAllForm(props: MessageAllFormProps) {
  const { unreachedUsers, onSubmit } = props;
  const { user } = useAuthContext();
  const { chatUser } = useAppContext();
  const [messageToAll, setMessageToAll] = useState<string>();

  /* -------------------------------------------------------------------------- */
  /*                         Fetch All Unreached Members                        */
  /* -------------------------------------------------------------------------- */

  const messageAllUnreached = async () => {
    if (user) {
      let unreachedChatUsers = [];
      for (const unreachedUser of unreachedUsers) {
        let DMChat = await checkForPreExistingDMChat(user, unreachedUser);

        if (!DMChat) {
          const results = await createDMChat(user, unreachedUser);

          if (!results) {
            return;
          }

          DMChat = results.chat;
        }

        const DMChatUsers = await DataStore.query(ChatUser, (chatUser) =>
          chatUser.chatID("eq", DMChat.id)
        );

        const currentChatUser = DMChatUsers.filter(
          (chatUser) => chatUser.user.id === user?.id
        )[0];

        const otherChatUser = DMChatUsers.filter(
          (chatUser) => chatUser.user.id !== user?.id
        )[0];

        const newMessage = new Message({
          messageBody: messageToAll,
          chatuserID: currentChatUser.id,
          chatID: DMChat.id,
        });

        uploadMessage(newMessage);

        DataStore.save(
          Chat.copyOf(DMChat, (updatedChat) => {
            updatedChat.lastMessage = messageToAll;
          })
        );

        unreachedChatUsers.push(otherChatUser);

        setMessageToAll("");
      }

      updateChatUserHasUnreadMessages(
        unreachedChatUsers.filter(
          (unreachedChatUser) => unreachedChatUser.id !== chatUser?.id
        ),
        true
      );
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
        onPress={async () => {
          if (messageToAll) {
            await messageAllUnreached();
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
