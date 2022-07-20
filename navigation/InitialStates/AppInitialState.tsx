import { Chat, ChatUser, Message } from "../../src/models";

export interface AppInitialStateProps {
  chat: Chat | null;
  members: ChatUser[];
  chatUser: ChatUser | null;
  eventTitle: string | null;
  eventDateTime: Date;
  eventLocation: string | null;
  addEventChat: boolean;
  eventCapacity: string | null;
  eventDescription: string | null;
  isForwardingEvent: boolean;
  messages: Message[];
  setChat: (chat: Chat) => Promise<void> | PromiseConstructor;
  setMembers: (members: ChatUser[]) => Promise<void> | PromiseConstructor;
  setChatUser: (chatUser: ChatUser) => Promise<void> | PromiseConstructor;
  setEventTitle: (eventTitle: string) => Promise<void> | PromiseConstructor;
  setEventDateTime: (datetime: Date) => Promise<void> | PromiseConstructor;
  setEventLocation: (
    eventLocation: string
  ) => Promise<void> | PromiseConstructor;
  setAddEventChat: (
    addEventChat: boolean
  ) => Promise<void> | PromiseConstructor;
  setEventCapacity: (
    eventCapacity: string
  ) => Promise<void> | PromiseConstructor;
  setEventDescription: (
    eventDescription: string
  ) => Promise<void> | PromiseConstructor;
  setIsForwardingEvent: (
    isForwardingEvent: boolean
  ) => Promise<void> | PromiseConstructor;
  setMessages: (messages: Message[]) => Promise<void> | PromiseConstructor;
}

export const initialState: AppInitialStateProps = {
  chat: null,
  members: [],
  chatUser: null,
  eventTitle: null,
  eventDateTime: new Date(),
  eventLocation: null,
  addEventChat: false,
  eventCapacity: null,
  eventDescription: null,
  isForwardingEvent: false,
  messages: [],
  setChat: () => Promise,
  setMembers: () => Promise,
  setChatUser: () => Promise,
  setEventTitle: () => Promise,
  setEventDateTime: () => Promise,
  setEventLocation: () => Promise,
  setAddEventChat: () => Promise,
  setEventCapacity: () => Promise,
  setEventDescription: () => Promise,
  setIsForwardingEvent: () => Promise,
  setMessages: () => Promise,
};
