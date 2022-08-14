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
export const chatsIncludeSpecificChat = (chats: Chat[], specificChat: Chat) => {
  return chats.map((chat) => chat.id).includes(specificChat.id);
};

export const getContactSubscription = (
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
      DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chatID)).then(
        (newChat) => {
          if (!chatsIncludeSpecificChat(chats, newChat[0])) {
            return setChats(prependChat(newChat[0], chats));
          }
        }
      );
    } else if (object.opType === "UPDATE") {
      const isOfActiveChat = !chatUser.isOfActiveChat;

      DataStore.query(Chat, (chat) => chat.id("eq", chatUser.chatID)).then(
        (updatedChat) => {
          let chatsList = chats;
          if (
            chatsIncludeSpecificChat(chats, updatedChat[0]) &&
            isOfActiveChat
          ) {
            chatsList = removeChat(updatedChat[0], chats);
          } else if (
            !chatsIncludeSpecificChat(chats, updatedChat[0]) &&
            !isOfActiveChat
          ) {
            chatsList = prependChat(updatedChat[0], chatsList);
          }

          return setChats(chatsList);
        }
      );
    }
  });

  return subscription;
};
