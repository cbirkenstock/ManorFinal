import { Chat, ChatUser } from "../../src/models";

export interface AppInitialStateProps {
  chat: Chat | null;
  members: ChatUser[];
  currentChatUser: ChatUser | null;
  newEventLocation: string | null;
}

export const initialState = {
  chat: null,
  members: [],
  currentChatUser: null,
  newEventLocation: null,
};
