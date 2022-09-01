import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
  AppState,
} from "react-native";

import { API, DataStore, graphqlOperation } from "aws-amplify";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { Ionicons, Octicons } from "@expo/vector-icons";

import useAuthContext from "../../hooks/useAuthContext";
import { animate, animateTwoSequence } from "../../managers/AnimationManager";
import { getContactSubscription } from "../../managers/SubscriptionManager";
import {
  fetchNotificationChat,
  setUpNotifications,
} from "../../managers/NotificationManager";

import Header from "../../components/Header";
import DropdownItem, { DropdownItemProps } from "../../components/DropdownItem";
import Contact, { MemoizedContact } from "../../components/Contact/Contact";

import Colors from "../../constants/Colors";
import { ContactScreenProps as Props } from "../../navigation/NavTypes";
import { Chat, ChatUser } from "../../src/models";
import { dropDown } from "../../constants/Dropdown";
import { hasBezels } from "../../constants/hasBezels";
import * as queries from "../../src/graphql/queries";
import {
  ZenObservable,
  Observable,
} from "../../node_modules/zen-observable-ts";
import { prependChat, removeChat } from "../../managers/ChatManager";
import useFetchCachedChats from "../../hooks/useFetchCachedChats";
import { onCreateChat, onUpdateChat } from "../../src/graphql/subscriptions";

export default function ContactScreen({ route, navigation }: Props) {
  const context = useAuthContext();
  const { user } = context;

  const [chats, setChats] = useState<Chat[]>([]);

  const hasRefreshedChatsRef = useRef<boolean>(false);

  const height = Dimensions.get("screen").height;
  const exitViewHeightAnim = useRef(new Animated.Value(0)).current;
  const exitViewOpacityAnim = useRef(new Animated.Value(0)).current;

  let contactSubscription: ZenObservable.Subscription;

  // const test = (specificChat: Chat) => {
  //   // console.log("CHATS", chats);
  //   let chatsList = removeChat(specificChat, chats);
  //   chatsList = prependChat(specificChat, chatsList);
  //   // console.log(chatsList.map((chat) => [chat.title, chat.lastMessage]));
  //   setChats("CHATSLIST", chatsList);
  // };

  /* -------------------------------------------------------------------------- */
  /*                                 Fetch Chats                                */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------- Sort Chats ------------------------------- */

  const sortChats = (chat1: Chat, chat2: Chat) => {
    if (chat1.updatedAt && chat2.updatedAt) {
      const chat1Date = new Date(chat1.updatedAt);
      const chat2Date = new Date(chat2.updatedAt);

      if (chat1Date.getTime() > chat2Date.getTime()) {
        return -1;
      } else {
        return 1;
      }
    }

    return 0;
  };

  /* ------------------------------ Refresh Chats ----------------------------- */

  let filter = {
    isOfActiveChat: {
      eq: true,
    },
  };

  const refreshContacts = async () => {
    const _chats = (
      (await API.graphql(
        graphqlOperation(queries.byUserID, {
          userID: user?.id,
          filter: filter,
          limit: 1000,
        })
      )) as any
    )?.data?.byUserID?.items
      ?.filter(
        (chatUser: ChatUser) =>
          // @ts-ignore
          !chatUser._deleted
      )
      ?.map((chatUser: ChatUser) => chatUser.chat)
      ?.sort(sortChats);

    hasRefreshedChatsRef.current = true;
    if (_chats) {
      setChats(_chats);
    }
  };

  useEffect(() => {
    refreshContacts();
  }, []);

  /* ------------------------------- fetch Chats ------------------------------ */

  useEffect(() => {
    const fetchChats = async () => {
      const _chats = (
        await DataStore.query(ChatUser, (chatUser) =>
          chatUser.userID("eq", user?.id ?? "").isOfActiveChat("eq", true)
        )
      )
        .map((chatUser) => {
          return chatUser.chat;
        })
        .sort(sortChats);

      !hasRefreshedChatsRef.current && setChats(_chats);
    };

    fetchChats();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             Notification Set Up                            */
  /* -------------------------------------------------------------------------- */

  /* ---------------------- Notification Response Handler --------------------- */

  const notificationRespondedTo = async (
    response: Notifications.NotificationResponse
  ) => {
    const results = await fetchNotificationChat(response, user);

    if (results?.chat && results.chatUser) {
      // @ts-ignore
      navigation.navigate("ChatNav", {
        screen: "ChatScreen",
        params: {
          chat: results.chat,
          chatUser: results.chatUser,
          members: results.members,
          displayUser: results.displayUser,
          chats: chats,
          setChats: setChats,
        },
      });
    }
  };

  /* -------------------------- Set Up Notifications -------------------------- */

  useEffect(() => {
    setUpNotifications(notificationRespondedTo, user);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                Subscriptions                               */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ App Listener ------------------------------ */

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        refreshContacts();
      } else {
        contactSubscription?.unsubscribe();
        hasRefreshedChatsRef.current = false;
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /* ---------------------------- Contact Listener ---------------------------- */

  useEffect(() => {
    if (hasRefreshedChatsRef.current) {
      contactSubscription = getContactSubscription(chats, setChats, user);
    }

    return () => contactSubscription?.unsubscribe();
  }, [chats]);

  /* -------------------------------------------------------------------------- */
  /*                               Sub-Components                               */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Header --------------------------------- */

  const ContactScreenHeader = () => {
    return (
      <Header
        title="Messages"
        buttons={[
          <Pressable
            key={"profileButton"}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Ionicons
              name={"person-circle-outline"}
              size={35}
              color={"white"}
            />
          </Pressable>,
          <Pressable
            key={"addChatButton"}
            onPress={() => {
              animate(exitViewHeightAnim, height, 0);
              animate(exitViewOpacityAnim, 1, 150);
            }}
          >
            <Octicons name="plus" size={35} color={"white"} />
          </Pressable>,
        ]}
        style={styles.header}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Contact -------------------------------- */

  const renderContact = ({ item }: { item: Chat }) => {
    return <MemoizedContact chat={item} chats={chats} setChats={setChats} />;
  };

  /* ----------------------------- Drop Down Item ----------------------------- */

  const renderDropdownItem = ({ item }: { item: DropdownItemProps["tab"] }) => {
    return (
      <DropdownItem
        tab={item}
        exitViewHeightAnim={exitViewHeightAnim}
        exitViewOpacityAnim={exitViewOpacityAnim}
        chats={chats}
        setChats={setChats}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.manorPurple, Colors.manorBackgroundGray]}
      start={[0, 0]}
      end={[0.1, 0.15]}
    >
      <StatusBar hidden />
      <FlatList
        style={styles.FlatList}
        numColumns={2}
        data={chats}
        renderItem={renderContact}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ContactScreenHeader />}
      />
      <Animated.View
        style={[
          styles.exitView,
          { height: exitViewHeightAnim, opacity: exitViewOpacityAnim },
        ]}
      >
        <Pressable
          style={styles.exitPressable}
          onPress={() => {
            animateTwoSequence(
              exitViewOpacityAnim,
              0,
              150,
              exitViewHeightAnim,
              0,
              0
            );
          }}
        >
          <FlatList
            style={styles.dropDown}
            data={dropDown}
            renderItem={renderDropdownItem}
            keyExtractor={(item) => item.caption}
            showsVerticalScrollIndicator={false}
          />
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginHorizontal: "5%",
    marginTop: hasBezels ? "5%" : "12%",
    marginBottom: "2%",
  },

  FlatList: {
    flex: 1,
  },

  chatPairContainer: {
    width: "100%",
    flexDirection: "row",
  },

  hangingChatContainer: {
    width: "50%",
    flexDirection: "row",
  },

  exitView: {
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  exitPressable: {
    flex: 1,
    paddingTop: "10%",
  },

  dropDown: {
    flex: 1,
  },
});
