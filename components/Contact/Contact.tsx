import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import { ChatUser, User } from "../../src/models";
import { DataStore } from "@aws-amplify/datastore";
import { Chat, Message } from "../../src/models";
import Colors from "../../constants/Colors";
import useAuthContext from "../../hooks/useAuthContext";
import { OuterContactScreenNavigationProps } from "../../navigation/NavTypes";
import CacheImage from "../CustomPrimitives/CacheImage";
import DefaultContactImage from "../DefaultContactImage";
import { styles } from "./styles";
import {
  extractDisplayUser,
  prependChat,
  removeChat,
} from "../../managers/ChatManager";
import { chatsIncludeSpecificChat } from "../../managers/SubscriptionManager";

interface ContactProps {
  contact: Chat;
  chats: Chat[];
  setChats: (value: React.SetStateAction<Chat[] | undefined>) => void;
}

export default function Contact(props: ContactProps) {
  const { contact, chats, setChats } = props;
  const { user } = useAuthContext();
  const navigation = useNavigation<OuterContactScreenNavigationProps>();

  const [members, setMembers] = useState<ChatUser[]>([]);
  const [displayUser, setDisplayUser] = useState<User | undefined>();
  const [contactChatUser, setContactChatUser] = useState<
    ChatUser | undefined
  >();

  /* -------------------------------------------------------------------------- */
  /*                                Subscription                                */
  /* -------------------------------------------------------------------------- */

  /*
  Checks whenever a chatUser belonging to specific chat is inserted or updated. If inserted then it is added to members
  if updated, check if it is current user, and then update has Unread Messages
  */
  useEffect(() => {
    const subscription = DataStore.observe(ChatUser, (chatUser) =>
      chatUser.chatID("eq", contact?.id)
    ).subscribe((msg) => {
      const chatUser = msg.element;

      if (msg.opType === "INSERT") {
        const newMembers = [...members, msg.element];
        setMembers(newMembers);
      } else if (msg.opType === "UPDATE") {
        if (
          contact?.id == chatUser?.chat?.id &&
          user?.id == chatUser?.user?.id
        ) {
          setContactChatUser(chatUser);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = DataStore.observe(Chat, (chat) =>
      chat.id("eq", contact?.id)
    ).subscribe((msg) => {
      const chat = msg.element;

      if (msg.opType === "UPDATE") {
        if (chatsIncludeSpecificChat(chats, chat)) {
          if (
            chats[0].id === chat.id &&
            chats[0].lastMessage === chat.lastMessage
          ) {
            return;
          }

          let chatsList = removeChat(chat, chats);
          chatsList = prependChat(chat, chatsList);
          setChats(chatsList);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------- Set Display User ---------------------------- */

  useEffect(() => {
    if (!contact?.isGroupChat) {
      const _displayUser = extractDisplayUser(contact, user ?? undefined);
      _displayUser && setDisplayUser(_displayUser);
    }
  }, []);

  /* -------------------------- Set Current ChatUser -------------------------- */

  useEffect(() => {
    let unmounted = false;

    DataStore.query(ChatUser, (chatUser) =>
      chatUser.userID("eq", user?.id ?? "").chatID("eq", contact?.id)
    ).then((chatUserArray) => {
      !unmounted && chatUserArray[0] && setContactChatUser(chatUserArray[0]);
    });

    return () => {
      unmounted = true;
    };
  }, []);

  /* ------------------------------- Set Members ------------------------------ */

  useEffect(() => {
    let unmounted = false;

    if (!contact?.chatImageUrl) {
      DataStore.query(ChatUser, (chatUser) =>
        chatUser.chatID("eq", contact?.id)
      ).then((members) => {
        !unmounted && setMembers(members);
      });
    }

    return () => {
      unmounted = true;
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                Nav Function                                */
  /* -------------------------------------------------------------------------- */

  const openChat = () => {
    if (contactChatUser) {
      navigation.navigate("ChatNav", {
        screen: "ChatScreen",
        params: {
          chat: contact,
          chatUser: contactChatUser,
          members: members,
          displayUser: displayUser,
          chats: chats,
          setChats: setChats,
        },
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const requiresDefaultContactImage = !(
    contact?.chatImageUrl || displayUser?.profileImageUrl
  );

  const ContactIcon = () => {
    return (
      <TouchableOpacity style={styles.container} onPress={openChat}>
        <View
          style={[
            styles.newMessageView,
            {
              shadowColor: contactChatUser?.hasUnreadMessage
                ? Colors.manorLightBlue
                : contactChatUser?.hasUnreadAnnouncement
                ? Colors.manorRed
                : "black",
            },
          ]}
        >
          {requiresDefaultContactImage ? (
            <View style={styles.contactImage}>
              <DefaultContactImage members={members} />
            </View>
          ) : (
            <CacheImage
              source={contact?.chatImageUrl ?? displayUser?.profileImageUrl!}
              cacheKey={contact?.chatImageUrl ?? displayUser?.profileImageUrl!}
              style={styles.contactImage}
            />
          )}
        </View>
        <Text
          style={[
            styles.contactNameText,
            {
              color:
                contact?.isEventChat || contact?.isCoordinationChat
                  ? Colors.manorPurple
                  : "white",
            },
          ]}
        >
          {contact?.title ?? displayUser?.name}
        </Text>
        <Text style={styles.messagePreviewText} numberOfLines={1}>
          {contact?.lastMessage}
        </Text>
      </TouchableOpacity>
    );
  };

  return <ContactIcon />;
}

export const MemoizedContact = React.memo(Contact, () => {
  return false;
});
