import { DataStore, SortDirection } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import MessageBar from "../../components/MessageBar/MessageBar";
import Colors from "../../constants/Colors";
import useAppContext from "../../hooks/useAppContext";
import { ChatScreenProps as Props } from "../../navigation/NavTypes";
import { Chat, ChatUser, Message, PendingAnnouncement } from "../../src/models";
import DefaultContactImage from "../../components/DefaultContactImage";
import CacheImage from "../../components/CustomPrimitives/CacheImage";
import Announcement from "../../components/Announcement/Announcement";
import {
  updateChatUserHasUnreadAnnouncements,
  updateChatUserHasUnreadMessages,
} from "../../managers/ChatUserManager";
import { messageSubscription } from "../../managers/SubscriptionManager";
import {
  appendMessage,
  updateMessageLocally,
} from "../../managers/MessageManager";
import { chatFlatlistButtons } from "../../constants/chatFlatlistButtonData";
import { animate } from "../../managers/AnimationManager";
import IconButton, {
  IconButtonProps,
} from "../../components/IconButton/IconButton";
import Dialog from "../../components/Dialog";
import AnnouncementCreationForm from "../../components/Dialog/DialogForms/AnnouncementCreationForm/AnnouncementCreationForm";
import useAuthContext from "../../hooks/useAuthContext";
import ImageView from "react-native-image-viewing";
import { hasBezels } from "../../constants/hasBezels";
import FullMessageComponent from "../../components/Message/FullMessageComponent/FullMessageComponent";
import EventMessage from "../../components/Message/SubComponents/EventMessage";
import EventSuggestionMessage from "../../components/Message/SubComponents/EventSuggestionMessage/EventSuggestionMessage";

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

  const { user } = useAuthContext();

  const [chats, setChats] = useState<Chat[]>();
  const [zoomImage, setZoomImage] = useState<{ uri: string }[]>([]);
  const [isAnnouncementDialogVisible, setIsAnnouncementDialogVisible] =
    useState<boolean>(false);

  const chatFlatlistButtonsHeightAnim = useRef(new Animated.Value(0)).current;
  const chatcontextUpdated = chat?.id === route.params?.chat.id;
  const chatScreenSetChats = route.params.setChats;

  /* -------------------------------------------------------------------------- */
  /*                             Set Proper Context                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    /*
    set messages to empty in case you open a new chat from chatInfo, in which case you 
    don't want to show the old messages
    */
    setMessages([]);

    updateChatUserHasUnreadMessages([route.params?.chatUser], false);
    updateChatUserHasUnreadAnnouncements([route.params?.chatUser], false);

    setChatUser(route.params?.chatUser);
    setChat(route.params?.chat);

    route.params?.members
      ? setMembers(route.params?.members)
      : fetchMembers().then(async (members) => setMembers(members));

    route.params?.chats
      ? setChats(route.params?.chats)
      : fetchChats().then(setChats);
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
  /*                                 Fetch Chats                                */
  /* -------------------------------------------------------------------------- */

  const fetchChats = async () => {
    const chats = (
      await DataStore.query(ChatUser, (chatUser) =>
        chatUser.userID("eq", user?.id ?? "")
      )
    ).map((chatUser) => chatUser.chat);
    return chats;
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

  /* ------------------------- Keyboard Subscriptions ------------------------- */

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => {
      animate(chatFlatlistButtonsHeightAnim, 165, 300);
    });
  }, []);

  useEffect(() => {
    Keyboard.addListener("keyboardWillHide", () => {
      animate(chatFlatlistButtonsHeightAnim, 0, 300);
    });
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               Sub-Components                               */
  /* -------------------------------------------------------------------------- */

  const ChatFlatlistButtons = () => {
    return (
      <View style={styles.chatFlatlistButtons}>
        <Pressable
          style={styles.ChatInfoButton}
          onPress={() =>
            navigation.navigate("ChatInfoScreen", {
              displayUser: route.params?.displayUser,
              eventMessages: [],
              chats: route.params.chats,
              setChats: route.params.setChats,
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
        <Animated.FlatList
          style={{ marginTop: 7.5, height: chatFlatlistButtonsHeightAnim }}
          scrollEnabled={false}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item) => item.title}
          data={chatFlatlistButtons}
          renderItem={renderIconButton}
        />
      </View>
    );
  };

  const AnnouncementDialog = () => {
    return (
      <Dialog
        title="Add Announcement"
        width={350}
        visible={isAnnouncementDialogVisible}
        children={
          <AnnouncementCreationForm
            onSubmit={() => {
              setIsAnnouncementDialogVisible(false);
            }}
          />
        }
        onClose={() => {
          setIsAnnouncementDialogVisible(false);
        }}
      />
    );
  };

  const ZoomImageView = () => {
    return (
      <ImageView
        images={zoomImage}
        imageIndex={0}
        visible={zoomImage.length == 0 ? false : true}
        onRequestClose={() => {
          setZoomImage([]);
        }}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                       Render Flatlist Item Functions                       */
  /* -------------------------------------------------------------------------- */

  const renderMessage = ({ item }: { item: Message }) => {
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
        <FullMessageComponent message={item} setZoomImage={setZoomImage} />
      );
    }
  };

  const renderIconButton = ({
    item,
  }: {
    item: Omit<IconButtonProps, "onPress"> & { title: string };
  }) => {
    const { title, icon, color } = item;
    return (
      <IconButton
        style={{ marginBottom: 7.5 }}
        icon={icon}
        dimension={50}
        color={color}
        onPress={() => {
          if (title === "announcement") {
            setIsAnnouncementDialogVisible(true);
          }
        }}
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
        <AnnouncementDialog />
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
        <MessageBar
          chat={chat ?? undefined}
          chats={chats ?? []}
          setChats={chatScreenSetChats}
        />
        <ChatFlatlistButtons />
        <ZoomImageView />
      </KeyboardAvoidingView>
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

  pinMessageFlatlist: {
    position: "absolute",
    top: 0,
    width: "100%",
  },

  ChatInfoButton: {
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
  chatFlatlistButtons: {
    position: "absolute",
    top: "5%",
    right: "2.5%",
    alignItems: "center",
  },
});
