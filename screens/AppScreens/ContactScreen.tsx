import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
  AppState,
  AppStateStatus,
} from "react-native";

import { DataStore, Hub } from "aws-amplify";
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
import { MemoizedContact } from "../../components/Contact/Contact";

import Colors from "../../constants/Colors";
import { ContactScreenProps as Props } from "../../navigation/NavTypes";
import { Chat, ChatUser } from "../../src/models";
import { dropDown } from "../../constants/Dropdown";
import { hasBezels } from "../../constants/hasBezels";

export default function ContactScreen({ route, navigation }: Props) {
  const context = useAuthContext();
  const { user } = context;

  const [chats, setChats] = useState<Chat[]>([]);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const [downloadData, setDownloadData] = useState<boolean>(true);

  const height = Dimensions.get("screen").height;
  const exitViewHeightAnim = useRef(new Animated.Value(0)).current;
  const exitViewOpacityAnim = useRef(new Animated.Value(0)).current;

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

  /* ------------------------------- fetch Chats ------------------------------ */

  useEffect(() => {
    const fetchChats = async () => {
      if (!downloadData) return;

      const _chats = (
        await DataStore.query(ChatUser, (chatUser) =>
          chatUser.userID("eq", user?.id ?? "").isOfActiveChat("eq", true)
        )
      )
        .map((chatUser) => {
          return chatUser.chat;
        })
        .sort(sortChats);

      setChats(_chats);
      setDownloadData(false);
    };

    fetchChats();
  }, [appState, downloadData]);

  useEffect(() => {
    // Create listener
    if (appState !== "active") return;
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event, data } = hubData.payload;
      if (event === "ready") {
        setDownloadData(true);
      }
    });

    // Remove listener
    return () => listener();
  }, [appState]);

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
          displayUser: results.members,
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
      //DataStore.start();
      setAppState(status);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  /* ---------------------------- Contact Listener ---------------------------- */

  useEffect(() => {
    if (appState !== "active") return;
    const contactSubscription = getContactSubscription(chats, setChats, user);
    return () => {
      contactSubscription.unsubscribe();
    };
  }, [chats, appState]);

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
