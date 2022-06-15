import React, { createContext, useContext, useReducer } from "react";
import appReducer, { AppActionCase } from "../Reducers/AppReducer";
import { Chat, ChatUser, Message } from "../../src/models";
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

  const setNewEventLocation = async (newEventLocation: string) => {
    dispatch({
      type: AppActionCase.setNewEventLocation,
      payload: newEventLocation,
    });
  };

  const setMessages = async (messages: Message[]) => {
    dispatch({
      type: AppActionCase.setMessages,
      payload: messages,
    });
  };

  const value: AppInitialStateProps = {
    chat: state.chat,
    members: state.members,
    chatUser: state.chatUser,
    newEventLocation: state.newEventLocation,
    messages: state.messages,
    setChat,
    setMembers,
    setChatUser,
    setNewEventLocation,
    setMessages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
