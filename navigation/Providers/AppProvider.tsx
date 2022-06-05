import React, { createContext, useContext, useReducer } from "react";
import appReducer, { AppActionCase } from "../Reducers/AppReducer";
import { Chat, ChatUser } from "../../src/models";
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

  const setCurrentChatUser = async (chatUser: ChatUser) => {
    dispatch({
      type: AppActionCase.setCurrentChatUser,
      payload: chatUser,
    });
  };

  const setNewEventLocation = async (newEventLocation: string) => {
    dispatch({
      type: AppActionCase.setNewEventLocation,
      payload: newEventLocation,
    });
  };

  const value = {
    chat: state.chat,
    members: state.members,
    currentChatUser: state.currentChatUser,
    newEventLocation: state.newEventLocation,
    setChat,
    setMembers,
    setCurrentChatUser,
    setNewEventLocation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
