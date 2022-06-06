import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import { ChatUser, User } from "../../src/models";
import { DataStore } from "@aws-amplify/datastore";
import { Chat, Message } from "../../src/models";
import Colors from "../../constants/Colors";
import useAuthContext from "../../hooks/useAuthContext";
import { OuterContactScreenNavigationProp } from "../../navigation/NavTypes";
import CacheImage from "../../components/CacheImage";
import DefaultContactImage from "../DefaultContactImage";
import { styles } from "./styles";

interface ContactProps {
  contact: Chat;
}

export default function Contact(props: ContactProps) {
  const { contact } = props;
  const navigation = useNavigation<OuterContactScreenNavigationProp>();
  const { user } = useAuthContext();
  const [members, setMembers] = useState<ChatUser[]>([]);
  const [displayUser, setDisplayUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | undefined>();
  const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>();

  /* -------------------------------------------------------------------------- */
  /*                                Subscription                                */
  /* -------------------------------------------------------------------------- */

  /*
  Checks whenever a chatUser belonging to specific chat is inserted or updated. If inserted then it is added to members
  if updated, check if it is current user, and then update has Unread Messages
  */

  useEffect(() => {
    const subscription = DataStore.observe(ChatUser, (chatUser) =>
      chatUser.chatID("eq", contact.id)
    ).subscribe((msg) => {
      const chatUser = msg.element;

      if (msg.model === ChatUser && msg.opType === "INSERT") {
        const newMembers = [...members, msg.element];
        setMembers(newMembers);
      } else if (msg.model === ChatUser && msg.opType === "UPDATE") {
        if (contact.id == chatUser.chatID && user?.id == chatUser.userID) {
          setHasUnreadMessages(chatUser.hasUnreadMessage ?? true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
  /* -------------------------------------------------------------------------- */

  /*
  call all of these functions together becuase they only need to be called once and this way you don't need 
  4 rerenders
  */
  useEffect(() => {
    fetchDisplayUser();
    fetchHasUnreadMessages();
    fetchMembers();
    fetchLastMessage();
  }, []);

  const fetchDisplayUser = () => {
    if (!contact.isGroupChat) {
      const otherChatUser = members.find(
        (chatUser) => chatUser.userID !== user?.id
      );

      if (otherChatUser) {
        setDisplayUser(otherChatUser.user);
      }
    }
  };

  const fetchHasUnreadMessages = async () => {
    const hasUnreadMessages = (
      await DataStore.query(ChatUser, (chatUser) =>
        chatUser.userID("eq", user?.id ?? "").chatID("eq", contact.id)
      )
    ).map((chatUser) => chatUser.hasUnreadMessage)[0];

    setHasUnreadMessages(hasUnreadMessages ?? true);
  };

  const fetchMembers = async () => {
    if (!contact.isGroupChat || !contact.chatImageUrl) {
      const members = await DataStore.query(ChatUser, (chatUser) =>
        chatUser.chatID("eq", contact.id)
      );

      setMembers(members);
    }
  };

  const fetchLastMessage = async () => {
    if (contact.chatLastMessageId) {
      const _lastMessage = await DataStore.query(
        Message,
        contact.chatLastMessageId
      );

      setLastMessage(_lastMessage);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Nav Function                                */
  /* -------------------------------------------------------------------------- */

  const onPress = () => {
    navigation.navigate("ChatNav", {
      screen: "ChatScreen",
      params: {
        id: contact.id,
        isEventChat: contact.isEventChat ? true : false,
        members: members,
      },
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const requiresDefaultContactImage = !(
    contact.chatImageUrl || displayUser?.profileImageUrl
  );

  const ContactIcon = () => {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View
          style={[
            styles.newMessageView,
            {
              backgroundColor: hasUnreadMessages
                ? Colors.manorLightBlue
                : "transparent",
            },
          ]}
        >
          {requiresDefaultContactImage ? (
            <View style={[styles.contactImage, { backgroundColor: "#2d3238" }]}>
              <DefaultContactImage members={members} />
            </View>
          ) : (
            <CacheImage
              source={contact.chatImageUrl ?? displayUser?.profileImageUrl!}
              cacheKey={contact.chatImageUrl ?? displayUser?.profileImageUrl!}
              style={styles.contactImage}
            />
          )}
        </View>
        <Text
          style={[
            styles.contactNameText,
            { color: contact.isEventChat ? Colors.manorPurple : "white" },
          ]}
        >
          {contact?.title ?? displayUser?.name}
        </Text>
        <Text style={styles.messagePreviewText} numberOfLines={1}>
          {lastMessage?.messageBody}
        </Text>
      </TouchableOpacity>
    );
  };

  return <ContactIcon />;
}

export const MemoizedContact = React.memo(Contact);
