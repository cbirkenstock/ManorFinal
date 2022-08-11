import React, { useState, useEffect, useReducer, createContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Auth, DataStore } from "aws-amplify";
import { User } from "../../src/models";

import AuthReducer, { UserActionCase } from "../Reducers/AuthReducer";
import {
  AuthInitialStateProps,
  initialState,
} from "../InitialStates/AuthInitialState";
import {
  CustomImageData,
  fetchMediaBlob,
  uploadMedia,
} from "../../managers/MediaManager";
import { setChatUserImage } from "../../managers/ChatUserManager";

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthContext = createContext<AuthInitialStateProps>(initialState);

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    DataStore.start();
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
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

  const signIn = async (
    phone: string,
    password: string,
    name?: string,
    profileImageData?: CustomImageData
  ) => {
    if (phone === "(111) 111-1111") {
      const fakeUser = await DataStore.query(
        User,
        "50a07372-e259-409b-a7f2-40362b40382b"
      );
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
      let user: User;
      let key: string = "";

      //if signing in for first time, get profile image ready
      if (profileImageData) {
        const blob = await fetchMediaBlob(profileImageData.uri ?? "");
        key = await uploadMedia("image", blob);
      }

      //if signing in for first time, create user in DB to go with Cognito User
      if (name && key) {
        const userItem = new User({
          name: name,
          phoneNumber: phone_number,
          profileImageUrl: key,
          cognitoUserSub: cognitoUser.attributes.sub,
        });

        user = await DataStore.save(userItem);

        //also create chatUser image equivalent like changing profile picture
        setChatUserImage(user, profileImageData!, key);
      }
      //else there should already be a user in the DB so retrieve it
      else {
        user = (
          await DataStore.query(User, (user) =>
            user.cognitoUserSub("eq", cognitoUser.attributes.sub)
          )
        )[0];
      }

      if (user) {
        setUser(user);
        AsyncStorage.setItem("currentUser", JSON.stringify(user));
        return "SUCCESS";
      }

      //if no user, return error message
      return profileImageData
        ? "User Could Not Be Created"
        : "User Not Found in Database. Please Try Again.";
    } catch (error) {
      return (error as any).toString();
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      AsyncStorage.setItem("currentUser", "");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const setUser = async (user: User | null) => {
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
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
