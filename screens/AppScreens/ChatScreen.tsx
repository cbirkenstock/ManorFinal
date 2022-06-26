import { DataStore, SortDirection } from "aws-amplify";
import React, { useEffect } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
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
import { ChatUser, Message } from "../../src/models";
import EventMessage from "../../components/Message/EventMessage/EventMessage";
import { messageSubscription } from "../../managers/SubscriptionManager";
import { appendMessage } from "../../managers/MessageManager";

export default function ChatScreen({ route }: Props) {
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
  } = context;
  const chatcontextUpdated = chat?.id === route.params?.chat.id;

  /* -------------------------------------------------------------------------- */
  /*                             Set Proper Context                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setChatUser(route.params?.chatUser);
    setChat(route.params?.chat);

    route.params?.members
      ? setMembers(route.params?.members)
      : fetchMembers().then(async (members) => setMembers(members));
  }, []);

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
        const _messages = await DataStore.query(
          Message,
          (message) => message.chatID("eq", chat.id),
          {
            page: 0,
            limit: 30,
            sort: (message) => message.createdAt(SortDirection.DESCENDING),
          }
        );
        setMessages(_messages);
      }
    };

    fetchMessages();
  }, [chat]);

  /* -------------------------------------------------------------------------- */
  /*                                Subscription                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (messages) {
      const subscription = messageSubscription(context, appendMessage);
      return () => subscription.unsubscribe();
    }
  }, [messages]);

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.chatuserID === chatUser?.id;
    const sender = members.find((member) => member.id === item.chatuserID);

    if (item.eventChatID) {
      return <EventMessage message={item} />;
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
      <StatusBar hidden={true} />
      <FlatList
        style={[styles.messageFlatlist]}
        inverted
        keyboardDismissMode={"on-drag"}
        showsVerticalScrollIndicator={false}
        data={messages}
        keyExtractor={(message) => message.id}
        renderItem={renderMessage}
      />
      <MessageBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },

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
    left: 0,
    right: 0,
  },

  eventMaker: {
    width: "80",
  },

  exitButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.9,
  },
});
