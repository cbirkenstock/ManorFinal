import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { API, DataStore, graphqlOperation, SortDirection } from "aws-amplify";

import useAppContext from "../../hooks/useAppContext";
import {
  updateChatUserHasUnreadAnnouncements,
  updateChatUserHasUnreadMessages,
  updateChatUserUpToDate,
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
import { MemoizedFullMessageComponent } from "../../components/Message/FullMessageComponent/FullMessageComponent";
import ChatScreenButtonMenu from "../../components/ChatScreenButtonMenu";
import AnnouncementDialog from "../../components/Dialog/DialogInstances/AnnouncementDialog/AnnouncementDialog";
import AnnouncementSentNotification from "../../components/AnnouncementSentNotification";

import Colors from "../../constants/Colors";
import { ChatScreenProps as Props } from "../../navigation/NavTypes";
import { ChatUser, Message, PendingAnnouncement } from "../../src/models";
import { hasBezels } from "../../constants/hasBezels";
import ZoomImageView from "../../components/ZoomImageView";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import AbsoluteBlurReactionView from "../../components/AbsoluteBlurReactionView";
import AbsoluteBlurThreadFlatlist from "../../components/AbsoluteBlurThreadFlatlist";
import * as queries from "../../src/graphql/queries";

export default function ChatScreen({ navigation, route }: Props) {
  const context = useAppContext();
  const {
    chat,
    setChat,
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
  const [threadMessages, setThreadMessages] = useState<Message[]>();
  const [messageToReplyTo, setMessageToReplyTo] = useState<Message>();
  const [reactionMessageAndYCoordinate, setReactionMessageAndYCoordinate] =
    useState<{
      yCoordinate: number;
      message: Message;
    }>();

  const nextTokenRef = useRef<string>();
  const triggeredByNotificationRef = useRef<boolean>(
    route.params.triggeredByNotification && route.params?.chat === chat
      ? false
      : true
  );

  // useEffect(() => {
  //   Alert.alert(triggeredByNotificationRef.current.toString());
  // }, [route.params?.triggeredByNotification]);

  /* -------------------------------------------------------------------------- */
  /*                             Set Proper Context                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setMessages([]);

    updateChatUserUpToDate(route.params.chatUser);

    setChatUser(route.params?.chatUser);
    setChat(route.params?.chat);

    route.params?.members
      ? setMembers(route.params?.members)
      : fetchMembers().then(async (members) => setMembers(members));
  }, [route.params]);

  /* -------------------------------------------------------------------------- */
  /*                                Fetch Members                               */
  /* -------------------------------------------------------------------------- */

  const fetchMembers = async () => {
    const members = DataStore.query(ChatUser, (chatUser) =>
      chatUser.chatID("eq", route.params?.chat.id)
    );

    return members;
  };

  /* -------------------------------------------------------------------------- */
  /*                                Set Messages                                */
  /* -------------------------------------------------------------------------- */

  /* --------------------------- Get Cached Messages -------------------------- */

  useEffect(() => {
    const fetchMessages = async () => {
      const _messages = (
        await DataStore.query(
          Message,
          (message) => message.chatID("eq", route.params?.chat.id),
          {
            limit: 30,
            sort: (message) => message.createdAt(SortDirection.DESCENDING),
          }
        )
      ).filter((message) => !message.announcementBody);

      //makes sure that true query didn't actually beat cache
      if (nextTokenRef.current === undefined) {
        setMessages(_messages);
      }
    };

    fetchMessages();
  }, [route.params?.chat]);

  /* ---------------------------- Refresh Messages ---------------------------- */

  const refreshMessages = async () => {
    if (nextTokenRef.current === null) return;

    try {
      const { nextToken, items } = (
        (await API.graphql(
          graphqlOperation(queries.byChat, {
            chatID: route.params?.chat.id,
            limit: 30,
            nextToken: nextTokenRef.current,
          })
        )) as any
      ).data.byChat;

      const _messages = (items as Message[]).filter(
        (message) => !message.announcementBody
      );

      if (!nextTokenRef.current) {
        nextTokenRef.current = nextToken;
        setMessages(_messages as Message[]);
      } else {
        nextTokenRef.current = nextToken;
        setMessages([...messages, ..._messages]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    refreshMessages();
  }, [route.params.chat]);

  /* -------------------------------------------------------------------------- */
  /*                             Fetch Announcements                            */
  /* -------------------------------------------------------------------------- */

  //TODO -- make GraphQL
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (pendingAnnouncements.length === 0) {
        const today = new Date(formatDateTime(new Date())!);

        const _pendingAnnouncements = (
          await DataStore.query(
            PendingAnnouncement,
            (pendingAnnouncement) =>
              pendingAnnouncement.chatUserID(
                "eq",
                route.params?.chatUser.id ?? ""
              ),
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
    const subscription = messageSubscription(
      context,
      appendMessage,
      updateMessageLocally
    );

    return () => subscription.unsubscribe();
  }, [messages]);

  /* -------------------- Pending Announcement Subscription ------------------- */

  useEffect(() => {
    const subscription = pendingAnnouncementSubscription(
      context,
      appendPendingAnnouncement
    );

    return () => subscription.unsubscribe();
  }, [pendingAnnouncements]);

  /* ------------------------------ App Listener ------------------------------ */

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        if (!triggeredByNotificationRef.current) {
          refreshMessages();
        } else {
          triggeredByNotificationRef.current = false;
        }
      } else {
        unsubscribeAll();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /* ----------------------------- Unsubscribe All ---------------------------- */

  const unsubscribeAll = () => {
    nextTokenRef.current = undefined;
  };

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <MemoizedFullMessageComponent
        message={item}
        setReactionMessageAndYCoordinate={setReactionMessageAndYCoordinate}
        setZoomImage={setZoomImage}
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
            onEndReached={() => {
              refreshMessages();
            }}
            style={[styles.messageFlatlist]}
            inverted
            initialNumToRender={20}
            keyboardDismissMode={"on-drag"}
            showsVerticalScrollIndicator={false}
            data={messages}
            keyExtractor={(message) => message?.id}
            renderItem={renderMessage}
          />
          {messageToReplyTo ? (
            <AbsoluteBlurThreadFlatlist
              messageToReplyTo={messageToReplyTo}
              setMessageToReplyTo={setMessageToReplyTo}
              threadMessages={threadMessages}
              setThreadMessages={setThreadMessages}
            />
          ) : null}
        </View>
        <MessageBar
          chat={route.params?.chat}
          messageToReplyTo={messageToReplyTo}
          threadMessages={threadMessages}
          setThreadMessages={setThreadMessages}
        />
      </KeyboardAvoidingView>
      {!reactionMessageAndYCoordinate && !messageToReplyTo ? (
        <ChatScreenButtonMenu
          displayUser={route.params.displayUser}
          contactImageUrl={
            route.params.displayUser?.profileImageUrl ??
            route.params.chat.chatImageUrl ??
            undefined
          }
          menuFunctions={[
            () => {
              navigation.navigate("ChatInfoScreen", {
                displayUser: route.params?.displayUser,
              });
            },
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
      {reactionMessageAndYCoordinate ? (
        <AbsoluteBlurReactionView
          reactionMessageAndYCoordinate={reactionMessageAndYCoordinate}
          setReactionMessageAndYCoordinate={setReactionMessageAndYCoordinate}
          setMessageToReplyTo={setMessageToReplyTo}
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
