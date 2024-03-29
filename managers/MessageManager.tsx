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

export const createTimeCardComponent = (
  dateTime: Date,
  context: AppInitialStateProps
) => {
  const { chat } = context;

  const date = dateTime;

  const simpleDate =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

  const timeCard = new Message({
    timeCardDateTime: simpleDate,
    chatID: chat?.id,
    marginTop: getMarginTop(context),
  });

  return timeCard;
};

export const createTextMessageComponent = (
  messageBody: string,
  context: AppInitialStateProps,
  messageToReplyTo?: Message,
  messageToReplyToSenderName?: string,
  urlPreviewTitle?: string,
  urlPreviewWebsiteUrl?: string,
  urlPreviewImageUrl?: string
) => {
  const { chat, chatUser } = context;

  const newMessage = new Message({
    messageBody: messageBody,
    chatuserID: chatUser?.id,
    chatID: chat?.id,
    marginTop: getMarginTop(context),
    replyToMessageID: messageToReplyTo?.replyToMessageID
      ? messageToReplyTo?.replyToMessageID
      : messageToReplyTo?.id,
    replyToMessageSenderName: messageToReplyToSenderName,
    replyToMessageBody: messageToReplyTo?.messageBody,
    replyToMessageImageUrl: messageToReplyTo?.imageUrl,
    urlPreviewTitle: urlPreviewTitle,
    urlPreviewWebsiteUrl: urlPreviewWebsiteUrl,
    urlPreviewImageUrl: urlPreviewImageUrl,
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
  context: AppInitialStateProps,
  timeCard?: Message
) => {
  const { messages, setMessages } = context;

  if (timeCard) {
    setMessages([newMessage, timeCard, ...messages]);
  } else {
    setMessages([newMessage, ...messages]);
  }
};

export const appendPendingAnnouncement = (
  newPendingAnnouncement: PendingAnnouncement,
  context: AppInitialStateProps
) => {
  const { pendingAnnouncements, setPendingAnnouncements } = context;

  setPendingAnnouncements([newPendingAnnouncement, ...pendingAnnouncements]);
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

export const updateMessageLocally = (
  updatedMessage: Message,
  context: AppInitialStateProps
) => {
  const { messages, setMessages } = context;

  let updatedMessages = messages.map((message) => {
    if (message.id === updatedMessage.id) {
      return updatedMessage;
    } else {
      return message;
    }
  });

  setMessages(updatedMessages);
};

// export const updateEventMessageMembersCountInternally = (
//   messages: Message[],
//   eventMessage: Message
// ) => {
//   const updatedMessages = messages.map((message) => {
//     if (message.id === eventMessage.id) {
//       return {
//         ...message,
//         eventMembersCount: (eventMessage.eventMembersCount ?? 0) + 1,
//       } as Message;
//     } else {
//       return message;
//     }
//   });

//   return updatedMessages;
// };

/* -------------------------------------------------------------------------- */
/*                              Network Updating                              */
/* -------------------------------------------------------------------------- */

export const updateMessageLikes = async (message: Message) => {
  const upToDateMessage = await DataStore.query(Message, message.id);

  if (upToDateMessage) {
    DataStore.save(
      Message.copyOf(upToDateMessage, (updatedMessage) => {
        updatedMessage.likes = message.likes;
      })
    );
  }
};

export const uploadMessage = async (message: Message) => {
  await DataStore.save(message);
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
  newMessage: string,
  context: AppInitialStateProps
) => {
  const { chat, setChat, chatUser } = context;

  const upToDateChat = await DataStore.query(Chat, chat?.id ?? "");

  if (upToDateChat) {
    DataStore.save(
      Chat.copyOf(upToDateChat, (updatedChat) => {
        updatedChat.lastMessage = newMessage;
        updatedChat.lastMessageSenderID = chatUser?.id;
      })
    ).then(async (chat) => {
      setChat(chat);
      return chat;
    });
  }
};

export const updateEventMessageMembersCount = async (
  message: Message,
  newEventMembersCount: number
) => {
  DataStore.query(Message, message.id).then((upToDateMessage) => {
    if (upToDateMessage) {
      DataStore.save(
        Message.copyOf(upToDateMessage, (updatedMessage) => {
          updatedMessage.eventMembersCount = newEventMembersCount;
        })
      );
    }
  });
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
