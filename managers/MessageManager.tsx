import { DataStore } from "aws-amplify";
import { Chat, Message } from "../src/models";
import { AppInitialStateProps } from "../navigation/InitialStates/AppInitialState";

/* -------------------------------------------------------------------------- */
/*                             Message Categories                             */
/* -------------------------------------------------------------------------- */

export enum MessageEnum {
  text = "text",
  media = "media",
  event = "event",
  eventSuggestion = "eventSuggestion",
  announcement = "announcement",
}

/* -------------------------------------------------------------------------- */
/*                             Message Margin Top                             */
/* -------------------------------------------------------------------------- */

const getMarginTop = (context: AppInitialStateProps) => {
  const { chatUser, messages } = context;

  const lastMessage = messages[0];
  const partOfGroup = lastMessage?.chatuserID === chatUser?.id;

  if (!partOfGroup || lastMessage.eventChatID) {
    return 10;
  } else {
    return 1;
  }
};

/* -------------------------------------------------------------------------- */
/*                            Create Message Object                           */
/* -------------------------------------------------------------------------- */

export const createTextMessageComponent = (
  messageBody: string,
  context: AppInitialStateProps
) => {
  const { chat, chatUser } = context;

  const newMessage = new Message({
    messageBody: messageBody,
    chatuserID: chatUser?.id,
    chatID: chat?.id,
    marginTop: getMarginTop(context),
    rerender: true,
  });

  return newMessage;
};

export const createMediaMessageComponent = (
  url: string,
  height: number,
  width: number,
  context: AppInitialStateProps
) => {
  const { chat, chatUser } = context;

  const newMessage = new Message({
    imageUrl: url,
    imageHeight: height,
    imageWidth: width,
    chatuserID: chatUser?.id,
    chatID: chat?.id,
    marginTop: getMarginTop(context),
  });

  return newMessage;
};

export const createEventMessageComponent = (
  eventChatID: string,
  context: AppInitialStateProps
) => {
  const { chat, chatUser } = context;

  const newMessage = new Message({
    eventChatID: eventChatID,
    chatuserID: chatUser?.id,
    chatID: chat?.id,
    marginTop: 10,
  });

  return newMessage;
};

export const createAnnouncementComponent = (
  messageBody: string,
  isMandatory: boolean,
  link: string,
  context: AppInitialStateProps
) => {
  const { chat, chatUser } = context;

  const newMessage = new Message({
    messageBody: messageBody,
    isMandatory: isMandatory,
    link: link,
    chatuserID: chatUser?.id,
    chatID: chat?.id,
  });

  return newMessage;
};

/* -------------------------------------------------------------------------- */
/*                           Local Message Handling                           */
/* -------------------------------------------------------------------------- */

export const appendMessage = (
  newMessage: Message,
  context: AppInitialStateProps
) => {
  const { messages, setMessages } = context;

  setMessages([newMessage, ...messages]);
};

/* -------------------------------------------------------------------------- */
/*                              Network Updating                              */
/* -------------------------------------------------------------------------- */

export const uploadMessage = (message: Message) => {
  DataStore.save(message);
};

export const updateLastMessage = async (
  newMessage: Message,
  context: AppInitialStateProps
) => {
  const { chat, setChat } = context;

  if (chat) {
    DataStore.save(
      Chat.copyOf(chat, (updatedChat) => {
        updatedChat.lastMessage = newMessage;
      })
    ).then(async (chat) => setChat(chat));
  }
};
