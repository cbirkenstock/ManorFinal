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
  const { user } = useAuthContext();
  const navigation = useNavigation<OuterContactScreenNavigationProp>();

  const [members, setMembers] = useState<ChatUser[]>([]);
  const [displayUser, setDisplayUser] = useState<User | undefined>();
  const [lastMessage, setLastMessage] = useState<Message | undefined>();
  const [currentChatUser, setCurrentChatUser] = useState<
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

      if (msg.model === ChatUser && msg.opType === "INSERT") {
        const newMembers = [...members, msg.element];
        setMembers(newMembers);
      } else if (msg.model === ChatUser && msg.opType === "UPDATE") {
        if (contact?.id == chatUser.chatID && user?.id == chatUser.userID) {
          setCurrentChatUser(chatUser);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
  /* -------------------------------------------------------------------------- */

  /*
  call all of these functions together becuase they only need to be called once 
  and this way you don't need 4 rerenders
  */
  useEffect(() => {
    fetchDisplayUser();
    fetchCurrentChatUser();
    fetchMembers();
    fetchLastMessage();
  }, []);

  const fetchDisplayUser = () => {
    if (!contact?.isGroupChat) {
      const otherChatUser = members.find(
        (chatUser) => chatUser.userID !== user?.id
      );

      if (otherChatUser) {
        setDisplayUser(otherChatUser.user);
      }
    }
  };

  const fetchCurrentChatUser = async () => {
    const _currentChatUser = (
      await DataStore.query(ChatUser, (chatUser) =>
        chatUser.userID("eq", user?.id ?? "").chatID("eq", contact?.id)
      )
    )[0];

    setCurrentChatUser(_currentChatUser);
  };

  const fetchMembers = async () => {
    if (!contact?.isGroupChat || !contact?.chatImageUrl) {
      const members = await DataStore.query(ChatUser, (chatUser) =>
        chatUser.chatID("eq", contact?.id)
      );

      setMembers(members);
    }
  };

  const fetchLastMessage = async () => {
    if (contact?.chatLastMessageId) {
      const _lastMessage = await DataStore.query(
        Message,
        contact?.chatLastMessageId
      );

      setLastMessage(_lastMessage);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Nav Function                                */
  /* -------------------------------------------------------------------------- */

  const onPress = () => {
    if (currentChatUser) {
      navigation.navigate("ChatNav", {
        screen: "ChatScreen",
        params: {
          chat: contact,
          chatUser: currentChatUser,
          members: members.length > 0 ? members : undefined,
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
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View
          style={[
            styles.newMessageView,
            {
              backgroundColor: currentChatUser?.hasUnreadMessage
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
              source={contact?.chatImageUrl ?? displayUser?.profileImageUrl!}
              cacheKey={contact?.chatImageUrl ?? displayUser?.profileImageUrl!}
              style={styles.contactImage}
            />
          )}
        </View>
        <Text
          style={[
            styles.contactNameText,
            { color: contact?.isEventChat ? Colors.manorPurple : "white" },
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
