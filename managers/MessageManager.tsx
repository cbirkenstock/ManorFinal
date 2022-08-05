import { DataStore } from "aws-amplify";
import { Chat, ChatUser, Message, PendingAnnouncement } from "../src/models";
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

  if (!partOfGroup || lastMessage?.eventChatID || lastMessage?.eventDateTime) {
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

export const createEventSuggestionComponent = (
  context: AppInitialStateProps,
  eventDateTime: string,
  eventDescription?: string
) => {
  const { chat, chatUser } = context;

  const newMessage = new Message({
    suggestionStatus: "pending",
    eventDateTime: eventDateTime,
    eventDescription: eventDescription,
    chatuserID: chatUser?.id,
    chatID: chat?.id,
    marginTop: 10,
  });

  return newMessage;
};

export const createEventMessageComponent = (
  context: AppInitialStateProps,
  eventTitle: string,
  eventDateTime: Date,
  eventDescription?: string,
  eventLocation?: string,
  eventCapacity?: number,
  eventChatID?: string,
  chatID?: string
) => {
  const { chat } = context;

  const newMessage = new Message({
    isEventMessage: true,
    eventChatID: eventChatID,
    eventTitle: eventTitle,
    eventDateTime: eventDateTime.toISOString(),
    eventDescription: eventDescription,
    eventLocation: eventLocation,
    eventCapacity: eventCapacity,
    eventMembersCount: 0,
    chatID: chatID ? chatID : chat?.id,
    marginTop: 10,
  });

  return newMessage;
};

export const createAnnouncementComponent = (
  context: AppInitialStateProps,
  announcementBody: string,
  isMandatory: boolean,
  link?: string
) => {
  const { chat, chatUser } = context;

  const newMessage = new Message({
    announcementBody: announcementBody,
    isMandatory: isMandatory,
    isAnnouncementMessage: true,
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

export const removeAnnouncement = (
  context: AppInitialStateProps,
  answeredAnnouncement: Message
) => {
  const { pendingAnnouncements, setPendingAnnouncements } = context;

  setPendingAnnouncements(
    pendingAnnouncements.filter(
      (pendingAnnouncement) => pendingAnnouncement.id != answeredAnnouncement.id
    )
  );
};

export const updateEventMessageMembersCountInternally = (
  messages: Message[],
  eventMessage: Message
) => {
  const updatedMessages = messages.map((message) => {
    if (message.id === eventMessage.id) {
      return {
        ...message,
        eventMembersCount: eventMessage.eventMembersCount + 1,
      } as Message;
    } else {
      return message;
    }
  });

  return updatedMessages;
};

/* -------------------------------------------------------------------------- */
/*                              Network Updating                              */
/* -------------------------------------------------------------------------- */

export const uploadMessage = (message: Message) => {
  DataStore.save(message);
};

export const UploadPendingAnnouncements = (
  members: ChatUser[],
  announcement: Message
) => {
  for (const member of members) {
    DataStore.save(
      new PendingAnnouncement({
        chatUserID: member.id,
        chatUser: member,
        messageID: announcement.id,
        message: announcement,
      })
    );
  }
};

export const deletePendingAnnouncement = (
  answeredAnnouncement: PendingAnnouncement
) => {
  DataStore.delete(answeredAnnouncement);
};

export const updateLastMessage = async (
  newMessage: Message,
  context: AppInitialStateProps
) => {
  const { chat, setChat } = context;

  if (chat) {
    DataStore.save(
      Chat.copyOf(chat, (updatedChat) => {
        updatedChat.lastMessage =
          newMessage.messageBody ?? newMessage.announcementBody;
      })
    ).then(async (chat) => {
      setChat(chat);
      return chat;
    });
  }
};

export const updateEventMessageMembersCount = (
  message: Message,
  newEventMembersCount: number
) => {
  DataStore.save(
    Message.copyOf(message, (updatedMessage) => {
      updatedMessage.eventMembersCount = newEventMembersCount;
    })
  );
};

export const updatedMessageEventStatus = async (
  message: Message,
  accepted: Boolean
) => {
  DataStore.save(
    Message.copyOf(message, (updatedMessage) => {
      updatedMessage.suggestionStatus = accepted ? "accepted" : "rejected";
    })
  );
};
