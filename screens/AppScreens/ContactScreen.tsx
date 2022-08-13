import { DataStore, SortDirection } from "aws-amplify";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";
import Header from "../../components/Header";
import Contact from "../../components/Contact";
import useAuthContext from "../../hooks/useAuthContext";
import { ContactScreenProps as Props } from "../../navigation/NavTypes";
import { Chat, ChatUser } from "../../src/models";
import { animate, animateTwoSequence } from "../../managers/AnimationManager";
import { dropDown } from "../../constants/Dropdown";
import DropdownItem, { DropdownItemProps } from "../../components/DropdownItem";
import { getContactSubscription } from "../../managers/SubscriptionManager";
import {
  attachNotificationHandler,
  fetchNotificationChat,
  getPushNotificationPermissions,
  setNotificationHandler,
  setUpAndroidNotificationChanel,
  updateUserExpoToken,
} from "../../managers/NotificationManager";
import * as Notifications from "expo-notifications";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { hasBezels } from "../../constants/hasBezels";

export default function ContactScreen({ route, navigation }: Props) {
  const context = useAuthContext();
  const { user } = context;
  const [chats, setChats] = useState<Chat[]>();
  const height = Dimensions.get("screen").height;
  const exitViewHeightAnim = useRef(new Animated.Value(0)).current;
  const exitViewOpacityAnim = useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------------------------------- */
  /*                                 Fetch Chats                                */
  /* -------------------------------------------------------------------------- */

  const sortChats = (chat1: Chat, chat2: Chat) => {
    if (chat1.updatedAt && chat2.updatedAt) {
      if (chat1.updatedAt > chat2.updatedAt) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (!chats) {
        const _chats = (
          await DataStore.query(
            ChatUser,
            (chatUser) =>
              chatUser.userID("eq", user?.id ?? "").isOfActiveChat("eq", true),
            {
              sort: (chat) => {
                return chat.updatedAt(SortDirection.ASCENDING);
              },
            }
          )
        )
          .map((chatUser) => chatUser.chat)
          .sort(sortChats);

        //adds a fake contact if there are none so that at least the header is rendered
        if (_chats.length === 0) {
          const headerTrojanChat = new Chat({
            title: "Header_Trojan_Horse",
          });
          _chats.push(headerTrojanChat);
        }

        setChats(_chats);
      }
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
    const results = await fetchNotificationChat(response, user ?? undefined);

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
    const setUpNotifications = async () => {
      if (user) {
        setUpAndroidNotificationChanel();

        const notificationStatus = await getPushNotificationPermissions(user);

        if (notificationStatus === "granted") {
          updateUserExpoToken(user);
          setNotificationHandler();
          attachNotificationHandler(notificationRespondedTo);
        }
      }
    };

    setUpNotifications();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                Subscriptions                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const contactSubscription = getContactSubscription(
      context,
      chats ?? [],
      setChats
    );
    return () => {
      contactSubscription.unsubscribe();
    };
  }, [chats]);

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  /* --------------------------------- Contact -------------------------------- */

  const renderContact = ({ index }: { index: number }) => {
    const start = index === 0;
    const end = index === chats!.length - 1;
    const evenChat = index % 2 === 0;
    const noChats = chats![index].title === "Header_Trojan_Horse";
    const hangingChat = end && index % 2 === 0;

    const ContactHeader = () => {
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
          style={{
            marginHorizontal: "5%",
            marginTop: hasBezels ? "5%" : "12%",
            marginBottom: "2%",
          }}
        />
      );
    };

    const HangingChat = () => {
      return (
        <View style={styles.hangingChatContainer}>
          <Contact
            contact={chats![index]}
            chats={chats ?? []}
            setChats={setChats}
          />
        </View>
      );
    };

    const ChatPair = () => {
      return (
        <View style={styles.chatPairContainer}>
          <Contact
            contact={chats![index]}
            chats={chats ?? []}
            setChats={setChats}
          />
          <Contact
            contact={chats![index + 1]}
            chats={chats ?? []}
            setChats={setChats}
          />
        </View>
      );
    };

    return (
      <>
        {start && <ContactHeader />}
        {!noChats && evenChat && (hangingChat ? <HangingChat /> : <ChatPair />)}
      </>
    );
  };

  /* ----------------------------- Drop Down Item ----------------------------- */

  const renderDropdownItem = ({ item }: { item: DropdownItemProps["tab"] }) => {
    return (
      <DropdownItem
        tab={item}
        exitViewHeightAnim={exitViewHeightAnim}
        exitViewOpacityAnim={exitViewOpacityAnim}
        chats={chats ?? []}
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
        data={chats}
        renderItem={renderContact}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
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
