import { Chat, ChatUser, Message } from "../../src/models";

/* -------------------------------------------------------------------------- */
/*                                 Action Enum                                */
/* -------------------------------------------------------------------------- */

/*
enums are helpful for specifying class of constants such as strings so you 
don't have to write them all the time and can remove risk. It can also be helpful
for increasing readability. 
*/
export enum AppActionCase {
  setChat = "setChat",
  setMembers = "setMembers",
  setChatUser = "setChatUser",
  setNewEventLocation = "setNewEventLocation",
  setMessages = "setMessages",
}

/* -------------------------------------------------------------------------- */
/*                                Action Types                                */
/* -------------------------------------------------------------------------- */

/*
The reason we have multiple types like this is becuase if you merge all of the types under 
something like

type Action = { 
    type: AppActionCase
    payload: Chat | ChatUser[] | ChatUser | string | null
}

the reducer function fails but it can not properly type check between the cases
only by telling it which AppActionCase goes with which payload can it make sure types
are in order
*/

interface ChatAction {
  type: AppActionCase.setChat;
  payload: Chat | null;
}

interface MembersAction {
  type: AppActionCase.setMembers;
  payload: ChatUser[];
}

interface ChatUserAction {
  type: AppActionCase.setChatUser;
  payload: ChatUser | null;
}

interface NewEventLocationAction {
  type: AppActionCase.setNewEventLocation;
  payload: string | null;
}

interface MessageAction {
  type: AppActionCase.setMessages;
  payload: Message[];
}

type ActionTypes =
  | ChatAction
  | MembersAction
  | ChatUserAction
  | NewEventLocationAction
  | MessageAction;

/* -------------------------------------------------------------------------- */
/*                                 State Type                                 */
/* -------------------------------------------------------------------------- */

interface AppState {
  chat: Chat | null;
  members: ChatUser[];
  chatUser: ChatUser | null;
  newEventLocation: string | null;
  messages: Message[];
}

/* -------------------------------------------------------------------------- */
/*                                   Reducer                                  */
/* -------------------------------------------------------------------------- */

function appReducer(state: AppState, action: ActionTypes) {
  const { type, payload } = action;

  switch (type) {
    case AppActionCase.setChat:
      return {
        ...state,
        chat: payload,
      };
    case AppActionCase.setMembers:
      return {
        ...state,
        members: payload,
      };
    case AppActionCase.setChatUser:
      return {
        ...state,
        chatUser: payload,
      };
    case AppActionCase.setNewEventLocation:
      return {
        ...state,
        newEventLocation: payload,
      };
    case AppActionCase.setMessages:
      return {
        ...state,
        messages: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in AppReducer.`);
  }
}

export default appReducer;
