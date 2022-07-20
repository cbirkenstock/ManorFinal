import { DataStore } from "aws-amplify";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";
import { AuthInitialStateProps } from "../navigation/InitialStates/AuthInitialState";
import { Chat, ChatUser, Message } from "../src/models";
import { appendChat, removeChat } from "./ChatManager";

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

/*kinda a hack rn -- not sure hwy update getting called several times
and also called after INSERT */
const chatsIncludeSpecificChat = (chats: Chat[], specificChat: Chat) => {
  return chats.map((chat) => chat.id).includes(specificChat.id);
};

export const contactSubscription = (
  context: AuthInitialStateProps,
  chats: Chat[],
  setChats: SetChatsHandler
) => {
  const { user } = context;

  const subscription = DataStore.observe(ChatUser, (chatUser) =>
    chatUser.userID("eq", user?.id ?? "")
  ).subscribe((object) => {
    const chatUser = object.element;

    if (object.opType === "INSERT") {
      DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chat.id)).then(
        (newChat) => {
          if (!chatsIncludeSpecificChat(chats, newChat[0])) {
            return appendChat(newChat[0], chats, setChats);
          }
        }
      );
    } else if (object.opType === "UPDATE") {
      if (chatUser.isOfActiveChat) {
        DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chat.id)).then(
          (activatedChat) => {
            if (!chatsIncludeSpecificChat(chats, activatedChat[0])) {
              return appendChat(activatedChat[0], chats, setChats);
            }
          }
        );
      } else {
        DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chat.id)).then(
          (deactivatedChat) => {
            if (chatsIncludeSpecificChat(chats, deactivatedChat[0])) {
              return removeChat(deactivatedChat[0], chats, setChats);
            }
          }
        );
      }
    }
  });

  return subscription;
};
