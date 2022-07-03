import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AppStack } from "./Stacks/AppStack";
import { AuthStack } from "./Stacks/AuthStack";
import { View } from "react-native";

import useAuthContext from "../hooks/useAuthContext";
import React from "react";
import Colors from "../constants/Colors";

export const Router = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.manorBackgroundGray }}
      ></View>
    );
  } else {
    return (
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    );
  }
};

//theme={{ colors: { background: "#000" } }}
