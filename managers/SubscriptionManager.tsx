import { API, DataStore, graphqlOperation } from "aws-amplify";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import {
  Chat,
  ChatUser,
  Message,
  PendingAnnouncement,
  User,
} from "../src/models";
import { Observable } from "../node_modules/zen-observable-ts";
import * as subscriptions from "../src/graphql/subscriptions";
import { Alert } from "react-native";

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
  OnInsert: MessageSubscriptionHandler,
  onUpdate: MessageSubscriptionHandler
) => {
  const { chat, chatUser, messages } = context;
  const subscription = DataStore.observe(Message, (message) =>
    message.chatID("eq", chat?.id ?? "")
  ).subscribe((object) => {
    const message = object.element;
    const isMe = message.chatuserID === chatUser?.id;
    if (object.opType === "INSERT" && !message.announcementBody) {
      if (!messageIncluded(messages, message, chatUser ?? undefined)) {
        OnInsert(message, context);
      }
    } else if (object.opType === "UPDATE") {
      onUpdate(message, context);
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

const hasUnreadMessages = (
  updatedChat: Chat,
  chatUser: ChatUser,
  currentActiveChat?: Chat
) => {
  if (
    updatedChat.lastMessageSenderID === chatUser?.id ||
    currentActiveChat?.id === updatedChat.id
  ) {
    return false;
  }

  return true;
};

export const initializeUpdatedChatSubscription = (
  chat: Chat,
  onUpdate: (updatedChatUser: ChatUser) => void,
  user?: User
) => {
  const observable = API.graphql(
    graphqlOperation(subscriptions.onUpdateChatByID, {
      id: chat.id,
    })
  ) as Observable<object>;

  const subscription = observable.subscribe({
    next: (chatMetaInfo) => {
      const updatedChat: Chat = (chatMetaInfo as any).value.data
        .onUpdateChatByID;

      DataStore.query(ChatUser, (chatUser) =>
        chatUser.userID("eq", user?.id ?? "").chatID("eq", updatedChat.id)
      ).then((_chatUsers) => {
        const chatUser = _chatUsers[0];

        const updatedChatUser: ChatUser = {
          ...chatUser,
          hasUnreadMessage: hasUnreadMessages(updatedChat, chatUser),
          chat: updatedChat,
        };

        onUpdate(updatedChatUser);
      });
    },
    error: () => {},
  });
  return subscription;
};

/*kinda a hack rn -- not sure why update getting called several times
and also called after INSERT */
export const chatIncluded = (chats: Chat[], specificChat: Chat) => {
  return chats.filter((chat) => chat.id === specificChat.id)?.[0];
  //return chats.map((chat) => chat.id).includes(specificChat.id);
};

export const getContactSubscription = (
  onEvent: (chatUser: ChatUser) => void,
  user?: User
) => {
  const subscription = DataStore.observe(ChatUser, (chatUser) =>
    chatUser.userID("eq", user?.id ?? "")
  ).subscribe((object) => {
    const chatUser = object.element;

    if (object.opType === "UPDATE") {
      onEvent(chatUser);
    }

    if (object.opType === "INSERT" && chatUser.isOfActiveChat) {
      onEvent(chatUser);
    }
  });

  return subscription;
};
