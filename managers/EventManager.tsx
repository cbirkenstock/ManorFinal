import { Chat, Message } from "../src/models";

export const getEventTitle = (eventMessage: Message, chat?: Chat) => {
  if (chat && eventMessage.eventTitle?.includes("+")) {
    const groupNames = eventMessage.eventTitle?.split("+");

    if (groupNames[0] === chat?.title) {
      return `${groupNames[1]} Mixer`;
    } else {
      return `${groupNames[0]} Mixer`;
    }
  } else {
    return eventMessage.eventTitle ?? "";
  }
};
