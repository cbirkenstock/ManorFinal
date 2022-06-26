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
      const authUser = await Auth.currentAuthenticatedUser();
      if (authUser) {
        const user = await AsyncStorage.getItem("currentUser").then(
          (data) => data && JSON.parse(data)
        );
        setUser(user);
      }
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
        await Auth.signUp({
          username,
          password,
          attributes: {
            name,
            phone_number,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const confirmSignUp = async (phone: string, code: string) => {
    if (phone != null && code != null) {
      const phone_number =
        "+" + "1" + phone.slice(1, 4) + phone.slice(6, 9) + phone.slice(10, 14);
      try {
        await Auth.confirmSignUp(phone_number, code);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const signIn = async (phone: string, password: string) => {
    const phone_number =
      "+" + "1" + phone.slice(1, 4) + phone.slice(6, 9) + phone.slice(10, 14);
    try {
      const cognitoUser = await Auth.signIn(phone_number, password);
      const user = await DataStore.query(User, cognitoUser.attributes.sub);
      if (user) {
        setUser(user);
        AsyncStorage.setItem("currentUser", JSON.stringify(user));
      }
    } catch (error) {
      if (typeof error === "string") {
        Alert.alert("Error", error, [
          {
            text: "OK",
            style: "cancel",
          },
        ]);
      }
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
