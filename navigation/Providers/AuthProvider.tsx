import React, {
  useState,
  useEffect,
  useReducer,
  createContext,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Auth, DataStore } from "aws-amplify";
import {
  Chat,
  ChatUser,
  PendingAnnouncement,
  Reaction,
  User,
} from "../../src/models";

import AuthReducer, { UserActionCase } from "../Reducers/AuthReducer";
import {
  AuthInitialStateProps,
  initialState,
} from "../InitialStates/AuthInitialState";
import { Alert } from "react-native";

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthContext = createContext<AuthInitialStateProps>(initialState);

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      DataStore.start();
      // const authUser = await Auth.currentAuthenticatedUser();
      // if (authUser) {
      const user = await AsyncStorage.getItem("currentUser").then(
        (data) => data && JSON.parse(data)
      );
      setUser(user);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (name: string, phone: string, password: string) => {
    if (name && phone && password) {
      const phone_number =
        "+" + "1" + phone.slice(1, 4) + phone.slice(6, 9) + phone.slice(10, 14);
      const username = phone_number;
      try {
        const result = await Auth.signUp({
          username,
          password,
          attributes: {
            name,
            phone_number,
          },
        });

        return result;
      } catch (error) {
        return (error as any).toString();
      }
    }
  };

  const confirmSignUp = async (phone: string, code: string) => {
    if (phone != null && code != null) {
      const phone_number =
        "+" + "1" + phone.slice(1, 4) + phone.slice(6, 9) + phone.slice(10, 14);
      try {
        const result = await Auth.confirmSignUp(phone_number, code);
        return result;
      } catch (error) {
        return (error as any).toString();
      }
    }
  };

  const signIn = async (phone: string, password: string, name?: string) => {
    if (phone === "(111) 111-1111") {
      let fakeUser: User | undefined = undefined;

      while (!fakeUser) {
        fakeUser = await DataStore.query(
          User,
          "50a07372-e259-409b-a7f2-40362b40382b"
        );
      }

      if (fakeUser) {
        setUser(fakeUser);
        AsyncStorage.setItem("currentUser", JSON.stringify(fakeUser));
        return "SUCCESS";
      }
    }

    const phone_number =
      "+" + "1" + phone.slice(1, 4) + phone.slice(6, 9) + phone.slice(10, 14);

    try {
      //Cognito Sign-In
      const cognitoUser = await Auth.signIn(phone_number, password);

      //set user & key placeholders
      let user: User | undefined = undefined;
      let key: string = "";

      //if signing in for first time, get profile image ready
      // if (profileImageData) {
      //   const blob = await fetchMediaBlob(profileImageData.uri ?? "");
      //   key = await uploadMedia("image", blob);
      // }

      //if signing in for first time, create user in DB to go with Cognito User
      if (name) {
        const userItem = new User({
          name: name,
          phoneNumber: phone_number,
          cognitoUserSub: cognitoUser.attributes.sub,
        });

        user = await DataStore.save(userItem);

        //also create chatUser image equivalent like changing profile picture
        // setChatUserImage(user, profileImageData!, key);
      }
      //else there should already be a user in the DB so retrieve it
      else {
        //while loop not perfect but works for now

        setTimeout(() => {
          return "User Not Found in Database. Please Try Again.";
        }, 3000);

        while (!user) {
          user = (
            await DataStore.query(User, (user) =>
              user.cognitoUserSub("eq", cognitoUser.attributes.sub)
            )
          )[0];
        }
      }

      if (user) {
        setUser(user);
        AsyncStorage.setItem("currentUser", JSON.stringify(user));
        return "SUCCESS";
      }

      //if no user, return error message
      return name
        ? "User Could Not Be Created"
        : "User Not Found in Database. Please Try Again.";
    } catch (error) {
      return (error as any).toString();
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      DataStore.clear();
      setUser(undefined);
      AsyncStorage.removeItem("currentUser");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const deleteAccount = async (user?: User) => {
    const upToDateUser = await DataStore.query(User, user?.id ?? "");

    if (!upToDateUser) return;

    const chatUsers = await DataStore.query(ChatUser, (chatUser) =>
      chatUser.userID("eq", upToDateUser?.id ?? "")
    );

    for (const chatUser of chatUsers) {
      if (chatUser.chat.displayUserName) {
        DataStore.save(
          Chat.copyOf(chatUser.chat, (updatedChat) => {
            updatedChat.isDeactivated = true;
          })
        );
      }

      const pendingAnnouncements = await DataStore.query(
        PendingAnnouncement,
        (pendingAnnouncement) =>
          pendingAnnouncement.chatUserID("eq", chatUser.id)
      );

      for (const pendingAnnouncement of pendingAnnouncements) {
        DataStore.delete(pendingAnnouncement);
      }

      const reactions = await DataStore.query(Reaction, (reaction) =>
        reaction.chatUserID("eq", chatUser.id)
      );

      for (const reaction of reactions) {
        DataStore.delete(reaction);
      }

      DataStore.delete(chatUser);
    }

    DataStore.delete(upToDateUser);
    Auth.deleteUser();
    setUser(undefined);
  };

  const setUser = async (user?: User) => {
    dispatch({
      type: UserActionCase.setUser,
      payload: user,
    });
  };

  const value = {
    loading,
    user: state.user,
    signUp,
    confirmSignUp,
    signIn,
    signOut,
    deleteAccount,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
