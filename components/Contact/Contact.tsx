import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import { ChatUser, User } from "../../src/models";
import Colors from "../../constants/Colors";
import useAuthContext from "../../hooks/useAuthContext";
import { OuterContactScreenNavigationProps } from "../../navigation/NavTypes";
import CacheImage from "../CustomPrimitives/CacheImage";
import { styles } from "./styles";
import { extractDisplayUser } from "../../managers/ChatManager";
import { MemoizedDefaultContactImage } from "../DefaultContactImage/DefaultContactImage";
import Avatar from "../Avatar";
import { animate } from "../../managers/AnimationManager";
import { DataStore } from "aws-amplify";

interface ContactProps {
  chatUser: ChatUser;
  chatUsers: ChatUser[];
  setChatUsers: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}

export default function Contact(props: ContactProps) {
  const { chatUser, chatUsers, setChatUsers } = props;

  const { user } = useAuthContext();
  const navigation = useNavigation<OuterContactScreenNavigationProps>();

  const [members, setMembers] = useState<ChatUser[]>([]);
  const [displayUser, setDisplayUser] = useState<User | undefined>();
  const [contactChatUser, setContactChatUser] = useState<ChatUser>(chatUser);

  const opacityAnim = useRef(new Animated.Value(0)).current;

  const chat = chatUser?.chat;

  /* -------------------------------------------------------------------------- */
  /*                                Subscription                                */
  /* -------------------------------------------------------------------------- */

  /* --------------------------- ChatUser & Members --------------------------- */

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
      }
      // else if (msg.opType === "UPDATE") {
      //   if (chat?.id == chatUser?.chat.id && user?.id == chatUser?.user.id) {
      //     if (contactChatUser.isOfActiveChat === chatUser.isOfActiveChat) {
      //       setContactChatUser(chatUser);
      //     }
      //   }
      // }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [members]);

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------- Set Display User ---------------------------- */

  useEffect(() => {
    if (chat && !chat.isGroupChat) {
      const _displayUser = extractDisplayUser(chat, user ?? undefined);
      _displayUser && setDisplayUser(_displayUser);
    }
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

  /* ------------------------------- Set Opacity ------------------------------ */

  useEffect(() => {
    animate(opacityAnim, 1, 300);
  }, []);
  /* -------------------------------------------------------------------------- */
  /*                                  On Press                                  */
  /* -------------------------------------------------------------------------- */

  const openChat = () => {
    if (chat && contactChatUser) {
      navigation.navigate("ChatNav", {
        screen: "ChatScreen",
        params: {
          chat: chat,
          chatUser: contactChatUser,
          members: members,
          displayUser: displayUser,
          triggeredByNotification: false,
        },
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const requiresDefaultContactImage =
    !chat?.chatImageUrl &&
    (!displayUser?.profileImageUrl ||
      displayUser?.profileImageUrl === "undefined" ||
      displayUser?.profileImageUrl === "null");

  const ContactIcon = () => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          openChat();
          setTimeout(() => {
            setContactChatUser({
              ...contactChatUser,
              hasUnreadAnnouncement: false,
              hasUnreadMessage: false,
            } as ChatUser);
          }, 300);
        }}
      >
        <Animated.View
          style={[
            styles.newMessageView,
            {
              shadowColor: contactChatUser?.hasUnreadAnnouncement
                ? Colors.manorRed
                : contactChatUser?.hasUnreadMessage
                ? Colors.manorLightBlue
                : "black",
              opacity: opacityAnim,
            },
          ]}
        >
          {requiresDefaultContactImage ? (
            <View style={styles.contactImage}>
              {displayUser ? (
                <Avatar
                  user={displayUser}
                  dimensions={0}
                  fontSize={70}
                  style={{ height: "100%", width: "100%" }}
                />
              ) : (
                <MemoizedDefaultContactImage members={members} fontSize={20} />
              )}
            </View>
          ) : (
            <CacheImage
              source={chat?.chatImageUrl ?? displayUser?.profileImageUrl}
              cacheKey={chat?.chatImageUrl ?? displayUser?.profileImageUrl}
              style={styles.contactImage}
            />
          )}
        </Animated.View>
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
  return (
    prevContact.chatUser?.chat.lastMessage ===
      newContact.chatUser?.chat.lastMessage &&
    prevContact.chatUser?.chat.displayUserProfileImageUrl ===
      newContact.chatUser?.chat.displayUserProfileImageUrl &&
    prevContact.chatUser?.chat.isDeactivated ===
      newContact.chatUser?.chat.isDeactivated &&
    prevContact.chatUser?.chat.createdAt === newContact.chatUser?.chat.createdAt
  );
};

export const MemoizedContact = React.memo(Contact, areEqual);
