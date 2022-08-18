import { DataStore } from "aws-amplify";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import { AuthInitialStateProps } from "../navigation/InitialStates/AuthInitialState";
import { Chat, ChatUser, Message, User } from "../src/models";
import { prependChat, removeChat } from "./ChatManager";
import { sendNotification } from "./NotificationManager";

/* -------------------------------------------------------------------------- */
/*                               Function Types                               */
/* -------------------------------------------------------------------------- */

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

export const messageSubscription = (
  context: AppInitialStateProps,
  insertHandler: MessageSubscriptionHandler,
  updateHandler: MessageSubscriptionHandler
) => {
  const { chat, chatUser } = context;

  const subscription = DataStore.observe(Message, (message) =>
    message.chatID("eq", chat?.id ?? "")
  ).subscribe((object) => {
    const message = object.element;
    const includesChatUserID = message.chatuserID;
    const isMe = message.chatuserID === chatUser?.id;

    if (object.opType === "INSERT" && includesChatUserID && !isMe) {
      // const user = DataStore.query(User, chatUser?.userID ?? "").then(
      //   (user) => {
      //     if (user && chatUser) {
      //       sendNotification(
      //         user,
      //         chat ?? undefined,
      //         [chatUser],
      //         message,
      //         true
      //       );
      //     }
      //   }
      // );

      insertHandler(message, context);
    } else if (object.opType === "UPDATE") {
      updateHandler(message, context);
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
  user?: User
) => {
  const subscription = DataStore.observe(ChatUser, (chatUser) =>
    chatUser.userID("eq", user?.id ?? "")
  ).subscribe((object) => {
    const chatUser = object.element;
    const chat = chatUser.chat;

    if (object.opType === "INSERT") {
      if (!chatIncluded(chats, chat)) {
        setChats(prependChat(chat, chats));
      }
    }

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
