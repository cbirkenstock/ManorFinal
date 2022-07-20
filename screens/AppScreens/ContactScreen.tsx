import { DataStore } from "aws-amplify";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Pressable,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import Header from "../../components/Header";
import Contact from "../../components/Contact";
import useAuthContext from "../../hooks/useAuthContext";
import { ContactScreenProps as Props } from "../../navigation/NavTypes";
import { Chat, ChatUser } from "../../src/models";
import { animateTwoSequence } from "../../managers/AnimationManager";
import { dropDown } from "../../constants/Dropdown";
import DropdownItem, { DropdownItemProps } from "../../components/DropdownItem";
import { contactSubscription } from "../../managers/SubscriptionManager";

export default function ContactScreen({ route, navigation }: Props) {
  const context = useAuthContext();
  const { user } = context;
  const [chats, setChats] = useState<Chat[]>();
  const exitViewHeightAnim = useRef(new Animated.Value(0)).current;
  const exitViewOpacityAnim = useRef(new Animated.Value(0)).current;

  /* -------------------------------------------------------------------------- */
  /*                                 Fetch Chats                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchChats = async () => {
      if (!chats) {
        const _chats = (
          await DataStore.query(ChatUser, (chatuser) =>
            chatuser.userID("eq", user?.id ?? "").isOfActiveChat("eq", true)
          )
        ).map((chatUser) => chatUser.chat);

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
  /*                                Subscriptions                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const subscription = contactSubscription(context, chats ?? [], setChats);
    //const a = testSubscription();
    return () => subscription.unsubscribe();
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

    const HeaderComponent = () => {
      return (
        <Header
          exitViewHeightAnim={exitViewHeightAnim}
          exitViewOpacityAnim={exitViewOpacityAnim}
        />
      );
    };

    const HangingChat = () => {
      return (
        <View style={styles.hangingChatContainer}>
          <Contact contact={chats![index]} />
        </View>
      );
    };

    const ChatPair = () => {
      return (
        <View style={styles.chatPairContainer}>
          <Contact contact={chats![index]} />
          <Contact contact={chats![index + 1]} />
        </View>
      );
    };

    return (
      <>
        {start && <HeaderComponent />}
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
        keyExtractor={(item) => (typeof item == "string" ? item : item?.id)}
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
