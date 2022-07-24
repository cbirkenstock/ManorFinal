import Announcement from "../../components/Announcement/Announcement";
import { Chat, ChatUser, Message, PendingAnnouncement } from "../../src/models";

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
  setEventTitle = "setEventTitle",
  setEventDateTime = "setEventDateTime",
  setEventLocation = "setNewEventLocation",
  setAddEventChat = "setAddEventChat",
  setEventCapacity = "setEventCapacity",
  setEventDescription = "setEventDescription",
  setIsForwardingEvent = "setIsForwardingEvent",
  setMessages = "setMessages",
  setPendingAnnouncements = "setPendingAnnouncements",
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

interface EventTitleAction {
  type: AppActionCase.setEventTitle;
  payload: string | null;
}

interface EventDateTimeAction {
  type: AppActionCase.setEventDateTime;
  payload: Date;
}
interface EventLocationAction {
  type: AppActionCase.setEventLocation;
  payload: string | null;
}

interface AddEventChatAction {
  type: AppActionCase.setAddEventChat;
  payload: boolean;
}

interface EventCapacityAction {
  type: AppActionCase.setEventCapacity;
  payload: string | null;
}

interface EventDescriptionAction {
  type: AppActionCase.setEventDescription;
  payload: string | null;
}

interface ForwardingEventAction {
  type: AppActionCase.setIsForwardingEvent;
  payload: boolean;
}

interface MessageAction {
  type: AppActionCase.setMessages;
  payload: Message[];
}

interface PendingAnnouncementAction {
  type: AppActionCase.setPendingAnnouncements;
  payload: PendingAnnouncement[];
}

type ActionTypes =
  | ChatAction
  | MembersAction
  | ChatUserAction
  | EventTitleAction
  | EventDateTimeAction
  | EventLocationAction
  | AddEventChatAction
  | EventCapacityAction
  | EventDescriptionAction
  | ForwardingEventAction
  | MessageAction
  | PendingAnnouncementAction;

/* -------------------------------------------------------------------------- */
/*                                 State Type                                 */
/* -------------------------------------------------------------------------- */

interface AppState {
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
  pendingAnnouncements: PendingAnnouncement[];
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
    case AppActionCase.setEventTitle:
      return {
        ...state,
        eventTitle: payload,
      };
    case AppActionCase.setEventDateTime:
      return {
        ...state,
        eventDateTime: payload,
      };
    case AppActionCase.setEventLocation:
      return {
        ...state,
        eventLocation: payload,
      };
    case AppActionCase.setAddEventChat:
      return {
        ...state,
        addEventChat: payload,
      };
    case AppActionCase.setEventCapacity:
      return {
        ...state,
        eventCapacity: payload,
      };
    case AppActionCase.setEventDescription:
      return {
        ...state,
        eventDescription: payload,
      };
    case AppActionCase.setIsForwardingEvent:
      return {
        ...state,
        isForwardingEvent: payload,
      };
    case AppActionCase.setMessages:
      return {
        ...state,
        messages: payload,
      };
    case AppActionCase.setPendingAnnouncements:
      return {
        ...state,
        pendingAnnouncements: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in AppReducer.`);
  }
}

export default appReducer;
