import { Chat, ChatUser, Message } from "../../src/models";

export interface AppInitialStateProps {
  chat: Chat | null;
  members: ChatUser[];
  chatUser: ChatUser | null;
  newEventLocation: string | null;
  messages: Message[];
  setChat: (chat: Chat) => Promise<void> | PromiseConstructor;
  setMembers: (members: ChatUser[]) => Promise<void> | PromiseConstructor;
  setChatUser: (chatUser: ChatUser) => Promise<void> | PromiseConstructor;
  setNewEventLocation: (
    newEventLocation: string
  ) => Promise<void> | PromiseConstructor;
  setMessages: (messages: Message[]) => Promise<void> | PromiseConstructor;
}

export const initialState = {
  chat: null,
  members: [],
  chatUser: null,
  newEventLocation: null,
  messages: [],
  setChat: () => Promise,
  setMembers: () => Promise,
  setChatUser: () => Promise,
  setNewEventLocation: () => Promise,
  setMessages: () => Promise,
};
