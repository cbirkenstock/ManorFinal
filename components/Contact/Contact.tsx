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

interface ContactProps {
  contact: Chat;
}

export default function Contact(props: ContactProps) {
  const { contact } = props;
  const { user } = useAuthContext();
  const navigation = useNavigation<OuterContactScreenNavigationProps>();

  const [members, setMembers] = useState<ChatUser[]>([]);
  const [displayUser, setDisplayUser] = useState<User | undefined>();
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
        if (
          contact?.id == chatUser?.chat?.id &&
          user?.id == chatUser?.user?.id
        ) {
          setCurrentChatUser(chatUser);
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
      const otherChatUser = members.find(
        (chatUser) => chatUser.user.id !== user?.id
      );

      otherChatUser && setDisplayUser(otherChatUser.user);
    }
  }, [members]);

  /* -------------------------- Set Current ChatUser -------------------------- */

  useEffect(() => {
    let unmounted = false;

    DataStore.query(ChatUser, (chatUser) =>
      chatUser.userID("eq", user?.id ?? "").chatID("eq", contact?.id)
    ).then((chatUserArray) => {
      !unmounted && chatUserArray[0] && setCurrentChatUser(chatUserArray[0]);
    });

    return () => {
      unmounted = true;
    };
  }, []);

  /* ------------------------------- Set Members ------------------------------ */

  useEffect(() => {
    let unmounted = false;

    if (!contact?.isGroupChat || !contact?.chatImageUrl) {
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
              shadowColor: currentChatUser?.hasUnreadMessage
                ? Colors.manorLightBlue
                : "black",
            },
          ]}
        >
          {requiresDefaultContactImage ? (
            <View style={styles.contactImage}>
              <DefaultContactImage members={members} />
            </View>
          ) : (
            <Image
              style={styles.contactImage}
              source={{
                uri: "https://thumbs.dreamstime.com/b/logo-show-text-template-show-vintage-marquee-light-show-sign-typography-d-render-61801158.jpg",
              }}
            />
            // <CacheImage
            //   source={contact?.chatImageUrl ?? displayUser?.profileImageUrl!}
            //   cacheKey={contact?.chatImageUrl ?? displayUser?.profileImageUrl!}
            //   style={styles.contactImage}
            // />
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
