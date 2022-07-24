import { DataStore, SortDirection } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import MessageBubble from "../../components/Message/MessageBubble/MessageBubble";
import MediaMessage from "../../components/Message/MediaMessage/MediaMessage";
import ContactImage from "../../components/Message/ContactImage";
import MessageBar from "../../components/MessageBar/MessageBar";
import ContactNameLabel from "../../components/Message/ContactNameLabel";
import Colors from "../../constants/Colors";
import useAppContext from "../../hooks/useAppContext";
import { ChatScreenProps as Props } from "../../navigation/NavTypes";
import { ChatUser, Message, PendingAnnouncement } from "../../src/models";
import EventMessage from "../../components/Message/EventMessage/EventMessage";
import DefaultContactImage from "../../components/DefaultContactImage";
import CacheImage from "../../components/CustomPrimitives/CacheImage";
import EventSuggestionMessage from "../../components/Message/EventSuggestionMessage/EventSuggestionMessage";
import Announcement from "../../components/Announcement/Announcement";

export default function ChatScreen({ navigation, route }: Props) {
  const context = useAppContext();
  const {
    chat,
    setChat,
    chatUser,
    setChatUser,
    members,
    setMembers,
    messages,
    setMessages,
    pendingAnnouncements,
    setPendingAnnouncements,
  } = context;

  const chatcontextUpdated = chat?.id === route.params?.chat.id;

  /* -------------------------------------------------------------------------- */
  /*                             Set Proper Context                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    /*
    set messages to empty in case you open a new chat from chatInfo, in which case you 
    don't want to show the old messages
    */
    setMessages([]);

    setChatUser(route.params?.chatUser);
    setChat(route.params?.chat);

    route.params?.members
      ? setMembers(route.params?.members)
      : fetchMembers().then(async (members) => setMembers(members));
  }, [route.params]);

  /* -------------------------------------------------------------------------- */
  /*                                Fetch Members                               */
  /* -------------------------------------------------------------------------- */

  /*
  I am using the route param here instead of waiting for global variable because
  I don't want to have to wait for update to chat to start members call -- it would also 
  require additional useEffect based on chat being set  
  */
  const fetchMembers = async () => {
    const members = DataStore.query(ChatUser, (chatUser) =>
      chatUser.chatID("eq", route.params?.chat.id)
    );

    return members;
  };

  /* -------------------------------------------------------------------------- */
  /*                               Fetch Messages                               */
  /* -------------------------------------------------------------------------- */

  /*
  We check to make sure that the chat global variable is updated to 
  what is should be before calling messages to make sure we don't pull
  down messages from wrong chat

  we do this instead of passing chat param from route directly 
  becuase the message component also relies on the global variable
  */
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatcontextUpdated && messages.length === 0) {
        const _messages = (
          await DataStore.query(
            Message,
            (message) => message.chatID("eq", chat.id),
            {
              page: 0,
              limit: 30,
              sort: (message) => message.createdAt(SortDirection.DESCENDING),
            }
          )
        ).filter((message) => !message.announcementBody);

        setMessages(_messages);
      }
    };

    fetchMessages();
  }, [chat]);

  /* -------------------------------------------------------------------------- */
  /*                             Fetch Announcements                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (chatcontextUpdated && pendingAnnouncements.length === 0) {
        const _pendingAnnouncements = await DataStore.query(
          PendingAnnouncement,
          (pendingAnnouncement) =>
            pendingAnnouncement.chatUserID("eq", chatUser?.id ?? ""),
          {
            sort: (announcement) =>
              announcement.createdAt(SortDirection.ASCENDING),
          }
        );

        setPendingAnnouncements(_pendingAnnouncements);
      }
    };

    fetchAnnouncements();
  }, [chat]);

  /* -------------------------------------------------------------------------- */
  /*                                Subscription                                */
  /* -------------------------------------------------------------------------- */

  // useEffect(() => {
  //   DataStore.query(ChatUserMessage).then((messages) => console.log(messages));
  //   if (messages) {
  //     const subscription = messageSubscription(context, appendMessage);
  //     return () => subscription.unsubscribe();
  //   }
  // }, [messages]);

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.chatuserID === chatUser?.id;
    const sender = members.find((member) => member.id === item.chatuserID);

    if (item.isEventMessage) {
      return (
        <View style={{ marginTop: item.marginTop ?? 1 }}>
          <EventMessage message={item} />
        </View>
      );
    } else if (item.eventDateTime) {
      return (
        <View style={{ marginTop: item.marginTop ?? 1 }}>
          <EventSuggestionMessage message={item} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: isMe ? "flex-end" : "flex-start",
            marginTop: item.marginTop ?? 1,
          }}
        >
          {!isMe && <ContactImage profileImageUrl={sender?.profileImageUrl} />}
          <View style={{ maxWidth: item.messageBody ? "68%" : undefined }}>
            {!isMe && <ContactNameLabel contactName={sender?.nickname} />}
            {item.messageBody && <MessageBubble message={item} />}
            {item.imageUrl && <MediaMessage message={item} />}
          </View>
        </View>
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={-42}
      enabled
    >
      {pendingAnnouncements.length > 0 && <Announcement />}
      <StatusBar hidden={true} />
      <FlatList
        style={[styles.messageFlatlist]}
        inverted
        keyboardDismissMode={"on-drag"}
        showsVerticalScrollIndicator={false}
        data={messages}
        keyExtractor={(message) => message?.id}
        renderItem={renderMessage}
      />
      <Pressable
        style={styles.ChatInfoButton}
        onPress={() =>
          navigation.navigate("ChatInfoScreen", {
            displayUser: route.params?.displayUser,
            eventMessages: [],
          })
        }
      >
        {route.params.displayUser ? (
          <CacheImage
            cacheKey={route.params.displayUser.profileImageUrl}
            source={route.params.displayUser.profileImageUrl}
            style={{ flex: 1 }}
          />
        ) : (
          <DefaultContactImage members={members} />
        )}
      </Pressable>
      <MessageBar chat={chat ?? undefined} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0,
    backgroundColor: Colors.manorChatScreenBlack,
    justifyContent: "space-between",
  },

  messageFlatlist: {
    paddingHorizontal: 5,
    marginBottom: 5,
  },

  pinMessageFlatlist: {
    position: "absolute",
    top: 0,
    width: "100%",
  },

  ChatInfoButton: {
    position: "absolute",
    top: "5%",
    right: "2.5%",
    height: 60,
    width: 60,
    backgroundColor: Colors.manorBlueGray,
    borderRadius: 50,
    justifyContent: "center",
    shadowColor: "#423f3f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 5,
    overflow: "hidden",
  },
});
