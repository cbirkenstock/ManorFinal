import React, { createContext, useReducer } from "react";
import appReducer, { AppActionCase } from "../Reducers/AppReducer";
import { Chat, ChatUser, Message, PendingAnnouncement } from "../../src/models";
import {
  AppInitialStateProps,
  initialState,
} from "../InitialStates/AppInitialState";

interface AppProviderProps {
  children: JSX.Element;
}

export const AppContext = createContext<AppInitialStateProps>(initialState);

export const AppProvider = (props: AppProviderProps) => {
  const { children } = props;
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setChat = async (chat: Chat) => {
    dispatch({
      type: AppActionCase.setChat,
      payload: chat,
    });
  };

  const setMembers = async (members: ChatUser[]) => {
    dispatch({
      type: AppActionCase.setMembers,
      payload: members,
    });
  };

  const setChatUser = async (chatUser: ChatUser) => {
    dispatch({
      type: AppActionCase.setChatUser,
      payload: chatUser,
    });
  };

  const setEventTitle = async (eventTitle: string) => {
    dispatch({
      type: AppActionCase.setEventTitle,
      payload: eventTitle,
    });
  };

  const setEventDateTime = async (eventDateTime: Date) => {
    dispatch({
      type: AppActionCase.setEventDateTime,
      payload: eventDateTime,
    });
  };

  const setEventLocation = async (newEventLocation: string) => {
    dispatch({
      type: AppActionCase.setEventLocation,
      payload: newEventLocation,
    });
  };

  const setAddEventChat = async (addEventChat: boolean) => {
    dispatch({
      type: AppActionCase.setAddEventChat,
      payload: addEventChat,
    });
  };

  const setEventCapacity = async (eventCapacity: string) => {
    dispatch({
      type: AppActionCase.setEventCapacity,
      payload: eventCapacity,
    });
  };

  const setEventDescription = async (eventDescription: string) => {
    dispatch({
      type: AppActionCase.setEventDescription,
      payload: eventDescription,
    });
  };

  const setIsForwardingEvent = async (isForwardingEvent: boolean) => {
    dispatch({
      type: AppActionCase.setIsForwardingEvent,
      payload: isForwardingEvent,
    });
  };

  const setMessages = async (messages: Message[]) => {
    dispatch({
      type: AppActionCase.setMessages,
      payload: messages,
    });
  };

  const setPendingAnnouncements = async (
    announcements: PendingAnnouncement[]
  ) => {
    dispatch({
      type: AppActionCase.setPendingAnnouncements,
      payload: announcements,
    });
  };

  const value: AppInitialStateProps = {
    chat: state.chat,
    members: state.members,
    chatUser: state.chatUser,
    eventTitle: state.eventTitle,
    eventDateTime: state.eventDateTime,
    eventLocation: state.eventLocation,
    addEventChat: state.addEventChat,
    eventCapacity: state.eventCapacity,
    eventDescription: state.eventDescription,
    isForwardingEvent: state.isForwardingEvent,
    messages: state.messages,
    pendingAnnouncements: state.pendingAnnouncements,
    setChat,
    setMembers,
    setChatUser,
    setEventTitle,
    setEventDateTime,
    setEventLocation,
    setAddEventChat,
    setEventCapacity,
    setEventDescription,
    setIsForwardingEvent,
    setMessages,
    setPendingAnnouncements,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
