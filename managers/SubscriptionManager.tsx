import { DataStore } from "aws-amplify";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import { AuthInitialStateProps } from "../navigation/InitialStates/AuthInitialState";
import { Chat, ChatUser, Message } from "../src/models";

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
  handler: MessageSubscriptionHandler
) => {
  const { chat, chatUser } = context;

  const subscription = DataStore.observe(Message, (message) =>
    message.chatID("eq", chat?.id ?? "")
  ).subscribe((object) => {
    const message = object.element;
    const isMe = message.chatuserID === chatUser?.id;

    if (object.opType === "INSERT" && !isMe) {
      handler(message, context);
    }
  });

  return subscription;
};

/* --------------------------------- Contact -------------------------------- */

export const contactSubscription = (
  context: AuthInitialStateProps,
  handler: ContactSubscriptionHandler,
  chats: Chat[],
  setChats: SetChatsHandler
) => {
  const { user } = context;

  const subscription = DataStore.observe(ChatUser, (chatUser) =>
    chatUser.userID("eq", user?.id ?? "")
  ).subscribe((object) => {
    const chatUser = object.element;

    if (object.opType === "INSERT") {
      DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chatID)).then(
        (chat) => handler(chat[0], chats, setChats)
      );
    }
  });

  return subscription;
};
