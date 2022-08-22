import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import { ChatUser, User } from "../../src/models";
import { DataStore } from "@aws-amplify/datastore";
import { Chat } from "../../src/models";
import Colors from "../../constants/Colors";
import useAuthContext from "../../hooks/useAuthContext";
import { OuterContactScreenNavigationProps } from "../../navigation/NavTypes";
import CacheImage from "../CustomPrimitives/CacheImage";
import { styles } from "./styles";
import {
  extractDisplayUser,
  prependChat,
  removeChat,
} from "../../managers/ChatManager";
import { chatIncluded } from "../../managers/SubscriptionManager";
import { MemoizedDefaultContactImage } from "../DefaultContactImage/DefaultContactImage";

interface ContactProps {
  chat: Chat;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export default function Contact(props: ContactProps) {
  const { chat, chats, setChats } = props;

  const { user } = useAuthContext();
  const navigation = useNavigation<OuterContactScreenNavigationProps>();

  const [members, setMembers] = useState<ChatUser[]>([]);
  const [displayUser, setDisplayUser] = useState<User | undefined>();
  const [contactChatUser, setContactChatUser] = useState<ChatUser>();

  /* -------------------------------------------------------------------------- */
  /*                                Subscription                                */
  /* -------------------------------------------------------------------------- */
  /*
  Checks whenever a chatUser belonging to specific chat is inserted or updated. If inserted then it is added to members
  if updated, check if it is current user, and then update has Unread Messages
  */
  useEffect(() => {
    const subscription = DataStore.observe(ChatUser, (chatUser) =>
      chatUser.chatID("eq", chat?.id)
    ).subscribe((msg) => {
      const chatUser = msg.element;

      if (msg.opType === "INSERT") {
        setMembers([...members, chatUser]);
      } else if (msg.opType === "UPDATE") {
        if (chat?.id == chatUser?.chat.id && user?.id == chatUser?.user.id) {
          setContactChatUser(chatUser);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [members]);

  useEffect(() => {
    const subscription = DataStore.observe(Chat, (_chat) =>
      _chat.id("eq", chat.id)
    ).subscribe((msg) => {
      const _chat = msg.element;
      if (msg.opType === "UPDATE") {
        if (chatIncluded(chats, _chat)) {
          if (chats[0].lastMessage === _chat.lastMessage) return;

          let chatsList = removeChat(_chat, chats);
          chatsList = prependChat(_chat, chatsList);
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
    if (!chat?.isGroupChat) {
      const _displayUser = extractDisplayUser(chat, user ?? undefined);
      _displayUser && setDisplayUser(_displayUser);
    }
  }, []);

  /* -------------------------- Set Current ChatUser -------------------------- */

  useEffect(() => {
    let unmounted = false;

    DataStore.query(ChatUser, (chatUser) =>
      chatUser.userID("eq", user?.id ?? "").chatID("eq", chat?.id)
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

    if (!chat?.chatImageUrl) {
      DataStore.query(ChatUser, (chatUser) =>
        chatUser.chatID("eq", chat?.id)
      ).then((members) => {
        !unmounted && setMembers(members);
      });
    }

    return () => {
      unmounted = true;
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  On Press                                  */
  /* -------------------------------------------------------------------------- */

  // const changeToUnread = () => {
  //   const updatedChatUser = {
  //     ...contactChatUser,
  //     hasUnreadMessage: false,
  //     hasUnreadAnnouncement: false,
  //   } as ChatUser;

  //   setContactChatUser(updatedChatUser);
  // };

  const openChat = () => {
    if (chat && contactChatUser) {
      navigation.navigate("ChatNav", {
        screen: "ChatScreen",
        params: {
          chat: chat,
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
    chat?.chatImageUrl || displayUser?.profileImageUrl
  );

  const ContactIcon = () => {
    return (
      <TouchableOpacity style={styles.container} onPress={openChat}>
        <View
          style={[
            styles.newMessageView,
            {
              shadowColor: contactChatUser?.hasUnreadAnnouncement
                ? Colors.manorRed
                : contactChatUser?.hasUnreadMessage
                ? Colors.manorLightBlue
                : "black",
            },
          ]}
        >
          {requiresDefaultContactImage ? (
            <View style={styles.contactImage}>
              <MemoizedDefaultContactImage members={members} />
            </View>
          ) : (
            <CacheImage
              source={chat?.chatImageUrl ?? displayUser?.profileImageUrl!}
              cacheKey={chat?.chatImageUrl ?? displayUser?.profileImageUrl!}
              style={styles.contactImage}
            />
          )}
        </View>
        <Text
          style={[
            styles.contactNameText,
            {
              color:
                chat?.isEventChat || chat?.isCoordinationChat
                  ? Colors.manorPurple
                  : "white",
            },
          ]}
        >
          {chat?.title ?? displayUser?.name}
        </Text>
        <Text style={styles.messagePreviewText} numberOfLines={1}>
          {chat?.lastMessage}
        </Text>
      </TouchableOpacity>
    );
  };

  return <ContactIcon />;
}

const areEqual = (prevContact: ContactProps, newContact: ContactProps) => {
  return prevContact.chat.lastMessage === newContact.chat.lastMessage;
};

export const MemoizedContact = React.memo(Contact, areEqual);
