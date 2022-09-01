import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  AppState,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import { ChatUser, User } from "../../src/models";
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
import { MemoizedDefaultContactImage } from "../DefaultContactImage/DefaultContactImage";
import Avatar from "../Avatar";
import { animate } from "../../managers/AnimationManager";
import { API, DataStore, graphqlOperation, Hub } from "aws-amplify";
import {
  onUpdateChat,
  onUpdateChatByID,
} from "../../src/graphql/subscriptions";
import { Observable } from "../../node_modules/zen-observable-ts";
import { chatIncluded } from "../../managers/SubscriptionManager";

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

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const appOpenedRef = useRef<boolean>(false);
  /* -------------------------------------------------------------------------- */
  /*                                Subscription                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setTimeout(() => {
      appOpenedRef.current = true;
    }, 2000);

    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        setTimeout(() => {
          appOpenedRef.current = true;
        }, 2000);
      } else {
        appOpenedRef.current = false;
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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

  /* ---------------------------------- Chat ---------------------------------- */

  // useEffect(() => {
  //   const subscription = DataStore.observe(Chat, (_chat) =>
  //     _chat.id("eq", chat.id)
  //   ).subscribe((msg) => {
  //     if (!appOpenedRef.current) return;

  //     const _chat = msg.element;
  //     if (msg.opType === "UPDATE" && _chat.updatedAt && chats[0].updatedAt) {
  //       const includedChat = chatIncluded(chats, _chat);
  //       if (
  //         includedChat &&
  //         !areEqual(
  //           { chat: _chat, chats, setChats },
  //           { chat: includedChat, chats, setChats }
  //         )
  //       ) {
  //         //console.log(_chat);
  //         // onChatUpdate?.(_chat);
  //         // let chatsList = removeChat(_chat, chats);
  //         // chatsList = prependChat(_chat, chatsList);
  //         // setChats(chatsList);
  //       }
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  const filter = {
    chatID: {
      eq: "4d4e4c0c-2ae2-45f5-8884-9600e23d970e",
    },
  };

  useEffect(() => {
    const observable = API.graphql({
      query: onUpdateChatByID,
      variables: { id: chat?.id },
    }) as Observable<object>;
    // const observable = API.graphql({query: onUpdateChat, variables: {id: "4d4e4c0c-2ae2-45f5-8884-9600e23d970e"}})}) as Observable<Chat>;

    const subscription = observable.subscribe({
      next: (chatMetaInfo) => {
        let updatedChat = (chatMetaInfo as any).value.data.onUpdateChatByID;

        let chatsList = removeChat(updatedChat, chats);
        chatsList = prependChat(updatedChat, chatsList);
        setChats(chatsList);
      },
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
          chats: chats,
          setChats: setChats,
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
            if (!contactChatUser) return;

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
    prevContact.chat.lastMessage === newContact.chat.lastMessage &&
    prevContact.chat.displayUserProfileImageUrl ===
      newContact.chat.displayUserProfileImageUrl &&
    prevContact.chat.isDeactivated === newContact.chat.isDeactivated &&
    prevContact.chat.createdAt === newContact.chat.createdAt
  );
};

export const MemoizedContact = React.memo(Contact, areEqual);
