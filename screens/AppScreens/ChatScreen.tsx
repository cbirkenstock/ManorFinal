import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { DataStore, SortDirection } from "aws-amplify";

import useAppContext from "../../hooks/useAppContext";
import {
  updateChatUserHasUnreadAnnouncements,
  updateChatUserHasUnreadMessages,
} from "../../managers/ChatUserManager";
import {
  messageSubscription,
  pendingAnnouncementSubscription,
} from "../../managers/SubscriptionManager";
import {
  appendMessage,
  appendPendingAnnouncement,
  updateMessageLocally,
} from "../../managers/MessageManager";
import { formatDateTime } from "../../managers/DateTimeManager";

import MessageBar from "../../components/MessageBar/MessageBar";
import Announcement from "../../components/Announcement/Announcement";
import FullMessageComponent, {
  MemoizedFullMessageComponent,
} from "../../components/Message/FullMessageComponent/FullMessageComponent";
import ChatScreenButtonMenu from "../../components/ChatScreenButtonMenu";
import AnnouncementDialog from "../../components/Dialog/DialogInstances/AnnouncementDialog/AnnouncementDialog";
import ReplyToMessageSection from "../../components/ReplyToMessageSection/ReplyToMessageSection";
import AnnouncementSentNotification from "../../components/AnnouncementSentNotification";

import Colors from "../../constants/Colors";
import { ChatScreenProps as Props } from "../../navigation/NavTypes";
import { ChatUser, Message, PendingAnnouncement } from "../../src/models";
import { hasBezels } from "../../constants/hasBezels";
import ZoomImageView from "../../components/ZoomImageView";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import MessageBubble from "../../components/Message/SubComponents/MessageBubble";
import MessageReactMenu from "../../components/MessageReactMenu/MessageReactMenu";
import AbsoluteBlurReactionView from "../../components/AbsoluteBlurReactionView";

export default function ChatScreen({ navigation, route }: Props) {
  const context = useAppContext();
  const {
    setChat,
    chat,
    setChatUser,
    chatUser,
    setMembers,
    messages,
    setMessages,
    pendingAnnouncements,
    setPendingAnnouncements,
  } = context;

  const [zoomImage, setZoomImage] = useState<ImageSource[]>([]);
  const [hasSentAnnouncement, setHasSentAnnouncement] =
    useState<boolean>(false);
  const [isAnnouncementDialogVisible, setIsAnnouncementDialogVisible] =
    useState<boolean>(false);
  const [messageToReplyTo, setMessageToReplyTo] = useState<Message>();
  const [reactionMessageAndYCoordinate, setReactionMessageAndYCoordinate] =
    useState<{
      yCoordinate: number;
      message: Message;
    }>();
  const [page, setPage] = useState<number>(0);

  const hasMoreMessages = useRef<boolean>(true);

  const chatcontextUpdated = chat?.id === route.params?.chat.id;
  const chats = route.params.chats;
  const chatScreenSetChats = route.params.setChats;

  const buttonPositionRef = useRef(null);

  /* -------------------------------------------------------------------------- */
  /*                             Set Proper Context                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setMessages([]);
    hasMoreMessages.current = true;

    updateChatUserHasUnreadMessages([route.params?.chatUser], false);
    updateChatUserHasUnreadAnnouncements([route.params?.chatUser], false);

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
      if (
        hasMoreMessages.current &&
        chatcontextUpdated &&
        (messages.length === 0 || page !== 0)
      ) {
        console.log("trigered");
        const _messages = (
          await DataStore.query(
            Message,
            (message) => message.chatID("eq", chat?.id),
            {
              page: page,
              limit: 30,
              sort: (message) => message.createdAt(SortDirection.DESCENDING),
            }
          )
        ).filter((message) => !message.announcementBody);

        if (_messages.length < 30) {
          hasMoreMessages.current = false;
        }

        if (page === 0) {
          setMessages(_messages);
        } else {
          setMessages([...messages, ..._messages]);
        }
      }
    };

    fetchMessages();
  }, [chat, page, messages]);

  /* -------------------------------------------------------------------------- */
  /*                             Fetch Announcements                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (chatcontextUpdated && pendingAnnouncements.length === 0) {
        const today = new Date(formatDateTime(new Date())!);

        const _pendingAnnouncements = (
          await DataStore.query(
            PendingAnnouncement,
            (pendingAnnouncement) =>
              pendingAnnouncement.chatUserID("eq", chatUser?.id ?? ""),
            {
              sort: (announcement) =>
                announcement.createdAt(SortDirection.ASCENDING),
            }
          )
        ).filter((pendingAnnouncement) => {
          return new Date(pendingAnnouncement.remindDate ?? today) <= today;
        });

        _pendingAnnouncements.length > 0 &&
          setPendingAnnouncements(_pendingAnnouncements);
      }
    };

    fetchAnnouncements();
  }, [chatUser]);

  /* -------------------------------------------------------------------------- */
  /*                                Subscriptions                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------- Message Subscription -------------------------- */

  useEffect(() => {
    if (messages) {
      const subscription = messageSubscription(
        context,
        appendMessage,
        updateMessageLocally
      );
      return () => subscription.unsubscribe();
    }
  }, [messages]);

  /* -------------------- Pending Announcement Subscription ------------------- */

  useEffect(() => {
    if (messages) {
      const subscription = pendingAnnouncementSubscription(
        context,
        appendPendingAnnouncement
      );
      return () => subscription.unsubscribe();
    }
  }, [pendingAnnouncements]);

  /* -------------------------------------------------------------------------- */
  /*                               Sub-Components                               */
  /* -------------------------------------------------------------------------- */

  const GoToChatInfoScreen = () => {
    navigation.navigate("ChatInfoScreen", {
      displayUser: route.params?.displayUser,
      eventMessages: [],
      chats: route.params.chats,
      setChats: route.params.setChats,
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <FullMessageComponent
        message={item}
        setReactionMessageAndYCoordinate={setReactionMessageAndYCoordinate}
        setZoomImage={setZoomImage}
        setMessageToReplyTo={setMessageToReplyTo}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
        enabled
        keyboardVerticalOffset={5}
      >
        <StatusBar hidden={true} />
        <View style={{ flex: 1 }}>
          <FlatList
            ref={buttonPositionRef}
            onEndReached={() => setPage(page + 1)}
            style={[styles.messageFlatlist]}
            inverted
            initialNumToRender={30}
            keyboardDismissMode={"on-drag"}
            showsVerticalScrollIndicator={false}
            data={messages}
            keyExtractor={(message) => message?.id}
            renderItem={renderMessage}
          />
          {reactionMessageAndYCoordinate ? (
            <AbsoluteBlurReactionView
              reactionMessageAndYCoordinate={reactionMessageAndYCoordinate}
              setReactionMessageAndYCoordinate={
                setReactionMessageAndYCoordinate
              }
            />
          ) : null}
        </View>

        {messageToReplyTo ? (
          <ReplyToMessageSection
            messageToReplyTo={messageToReplyTo}
            setMessageToReplyTo={setMessageToReplyTo}
          />
        ) : null}
        <MessageBar
          chat={chat ?? undefined}
          chats={chats ?? []}
          setChats={chatScreenSetChats}
          messageToReplyTo={messageToReplyTo}
          setMessageToReplyTo={setMessageToReplyTo}
        />
      </KeyboardAvoidingView>
      {!reactionMessageAndYCoordinate ? (
        <ChatScreenButtonMenu
          contactImageUrl={
            route.params.displayUser?.profileImageUrl ?? undefined
          }
          menuFunctions={[
            GoToChatInfoScreen,
            () => setIsAnnouncementDialogVisible(true),
          ]}
        />
      ) : null}
      {pendingAnnouncements.length > 0 && <Announcement />}
      {hasSentAnnouncement ? (
        <AnnouncementSentNotification
          setHasSentAnnouncement={setHasSentAnnouncement}
        />
      ) : null}
      {zoomImage.length > 0 ? (
        <ZoomImageView zoomImage={zoomImage} setZoomImage={setZoomImage} />
      ) : null}
      <AnnouncementDialog
        isAnnouncementDialogVisible={isAnnouncementDialogVisible}
        setIsAnnouncementDialogVisible={setIsAnnouncementDialogVisible}
        setHasSentAnnouncement={setHasSentAnnouncement}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.manorChatScreenBlack, flex: 1 },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: Colors.manorChatScreenBlack,
    justifyContent: "space-between",
    marginBottom: hasBezels ? 5 : 47.5,
  },

  messageFlatlist: {
    paddingHorizontal: 5,
    marginBottom: 5,
  },
});
