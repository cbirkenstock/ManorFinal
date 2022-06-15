import { DataStore, SortDirection } from "aws-amplify";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
} from "react-native";
import MessageBubble from "../../components/Message/MessageBubble/MessageBubble";
import MediaMessage from "../../components/Message/MediaMessage/MediaMessage";
import MessageBar from "../../components/MessageBar/MessageBar";
import Colors from "../../constants/Colors";
import useAppContext from "../../hooks/useAppContext";
import { ChatScreenProps as Props } from "../../navigation/NavTypes";
import { Message } from "../../src/models";
import EventMessage from "../../components/Message/EventMessage/EventMessage";
import { messageSubscription } from "../../managers/SubscriptionManager";
import { appendMessage } from "../../managers/MessageManager";
import { animate } from "../../managers/AnimationManager";

export default function ChatScreen({ route }: Props) {
  const context = useAppContext();
  const {
    chat,
    setChat,
    chatUser,
    setChatUser,
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

    if (route.params?.members) {
      setMembers(route.params?.members);
    }
  }, []);

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
    if (item.messageBody) {
      return <MessageBubble message={item} />;
    } else if (item.imageUrl) {
      return <MediaMessage message={item} />;
    } else {
      return <EventMessage message={item} />;
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
    backgroundColor: Colors.manorWarmBlack,
    justifyContent: "space-between",
  },

  messageFlatlist: {
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
