import { DataStore } from "aws-amplify";
import { Alert } from "react-native";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import { AuthInitialStateProps } from "../navigation/InitialStates/AuthInitialState";
import {
  Chat,
  ChatUser,
  Message,
  PendingAnnouncement,
  User,
} from "../src/models";
import { prependChat, removeChat } from "./ChatManager";
import { sendNotification } from "./NotificationManager";

/* -------------------------------------------------------------------------- */
/*                               Function Types                               */
/* -------------------------------------------------------------------------- */

/* ---------------------- Pending Announcement Handler ---------------------- */

type PendingAnnouncementHandler = (
  newPendingAnnouncement: PendingAnnouncement,
  context: AppInitialStateProps
) => void;

/* ----------------------------- Message Handler ---------------------------- */

type MessageSubscriptionHandler = (
  message: Message,
  context: AppInitialStateProps
) => void;

/* ----------------------------- Contact Handler ---------------------------- */

type ContactSubscriptionHandler = (
  newChat: Chat,
  chats: Chat[],
  setChats: (value: React.SetStateAction<Chat[] | undefined>) => void
) => void;

/* ---------------------------- Set Chats Handler --------------------------- */

type SetChatsHandler = (
  value: React.SetStateAction<Chat[] | undefined>
) => void;

/* -------------------------------------------------------------------------- */
/*                                Subscriptions                               */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Message -------------------------------- */

const messageIncluded = (
  messages: Message[],
  specificMessage: Message,
  chatUser?: ChatUser
) => {
  //this needs to be fixed for images later
  if (specificMessage.imageUrl) {
    return specificMessage.chatuserID === chatUser?.id;
  } else {
    return messages.map((message) => message.id).includes(specificMessage.id);
  }
};

export const messageSubscription = (
  context: AppInitialStateProps,
  insertHandler: MessageSubscriptionHandler,
  updateHandler: MessageSubscriptionHandler,
  dataDownloaded: boolean
) => {
  const { chat, chatUser, messages } = context;
  const subscription = DataStore.observe(Message, (message) =>
    message.chatID("eq", chat?.id ?? "")
  ).subscribe((object) => {
    if (!dataDownloaded) return;

    const message = object.element;
    Alert.alert(message.messageBody ?? "");
    const isMe = message.chatuserID === chatUser?.id;
    if (object.opType === "INSERT" && !message.announcementBody) {
      if (!messageIncluded(messages, message, chatUser ?? undefined)) {
        insertHandler(message, context);
      }
    } else if (object.opType === "UPDATE") {
      updateHandler(message, context);
    }
  });
  return subscription;
};

export const pendingAnnouncementSubscription = (
  context: AppInitialStateProps,
  insertHandler: PendingAnnouncementHandler
) => {
  const { chatUser } = context;

  const subscription = DataStore.observe(
    PendingAnnouncement,
    (pendingAnnouncement) =>
      pendingAnnouncement.chatUserID("eq", chatUser?.id ?? "")
  ).subscribe((object) => {
    const pendingAnnouncement = object.element;

    if (object.opType === "INSERT") {
      insertHandler(pendingAnnouncement, context);
    }
  });

  return subscription;
};

/* --------------------------------- Contact -------------------------------- */

/*kinda a hack rn -- not sure why update getting called several times
and also called after INSERT */
export const chatIncluded = (chats: Chat[], specificChat: Chat) => {
  return chats.map((chat) => chat.id).includes(specificChat.id);
};

export const getContactSubscription = (
  chats: Chat[],
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  user?: User,
  dataDownloaded?: boolean
) => {
  const subscription = DataStore.observe(ChatUser, (chatUser) =>
    chatUser.userID("eq", user?.id ?? "")
  ).subscribe((object) => {
    if (!dataDownloaded) return;

    const chatUser = object.element;
    const chat = chatUser.chat;

    if (object.opType === "UPDATE") {
      const isOfActiveChat = chatUser.isOfActiveChat;

      if (chatIncluded(chats, chat) && !isOfActiveChat) {
        setChats(removeChat(chat, chats));
      }

      if (!chatIncluded(chats, chat) && isOfActiveChat) {
        setChats(prependChat(chat, chats));
      }
    }
  });

  return subscription;
};
