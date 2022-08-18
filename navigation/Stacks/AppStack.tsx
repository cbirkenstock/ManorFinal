import React from "react";
import ChatInfoScreen from "../../screens/AppScreens/ChatInfoScreen";
import ContactScreen from "../../screens/AppScreens/ContactScreen";
import ProfileScreen from "../../screens/AppScreens/ProfileScreen";
import ChatScreen from "../../screens/AppScreens/ChatScreen";
import UnreachedMembersScreen from "../../screens/AppScreens/UnreachedMembersScreen";
import UsersScreen, { ChatEnum } from "../../screens/AppScreens/UsersScreen";
import GoogleFormsScreen from "../../screens/AppScreens/GoogleFormsScreen";
import GoogleMapsScreen from "../../screens/AppScreens/GoogleMapsScreen";
import AllItemsScreen, {
  AllItemType,
} from "../../screens/AppScreens/AllItemsScreen";
import Colors from "../../constants/Colors";
import { AppProvider } from "../Providers/AppProvider";
import {
  Chat,
  ChatUser,
  Message,
  PendingAnnouncement,
  User,
} from "../../src/models";
import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";

export type InnerAppStackParamList = {
  ContactNav: undefined;
  ChatNav: undefined;
  ContactScreen: undefined;
  ProfileScreen: undefined;
  ChatScreen: {
    chat: Chat;
    chatUser: ChatUser;
    members: ChatUser[] | undefined;
    displayUser: User | undefined;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  };
  ChatInfoScreen: {
    displayUser: User | undefined;
    eventMessages: Message[] | undefined;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  };
  UsersScreen: {
    chatType: ChatEnum;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  };
  GoogleMapsScreen: {
    link: string | undefined;
  };
  GoogleFormsScreen: { pendingAnnouncement: PendingAnnouncement };
  UnreachedMembersScreen: { announcementMessage: Message };
  AllItemsScreen: { allItemType: AllItemType };
};

export type OuterAppStackParamList = {
  ContactNav: NavigatorScreenParams<InnerAppStackParamList>;
  ChatNav: NavigatorScreenParams<InnerAppStackParamList>;
};

const InnerStack = createStackNavigator<InnerAppStackParamList>();

export const AppStack = () => {
  const ContactNav = () => {
    return (
      <InnerStack.Navigator detachInactiveScreens={false}>
        <InnerStack.Group>
          <InnerStack.Screen
            name="ContactScreen"
            component={ContactScreen}
            options={() => ({
              headerShown: false,
            })}
          />
          <InnerStack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              presentation: "modal",
              headerShown: false,
              title: "",
              headerBackTitleVisible: true,
              headerTintColor: Colors.manorPurple,
            }}
          />
          <InnerStack.Screen
            name="UsersScreen"
            component={UsersScreen}
            options={{
              headerShown: false,
              // headerLeft: () => null,
              // headerTitle: () => (
              //   <Text
              //     style={{
              //       color: "white",
              //       fontSize: 35,
              //       fontWeight: "700",
              //     }}
              //   >
              //     Create Group
              //   </Text>
              // ),
              // headerBackTitleVisible: false,
              // headerTintColor: Colors.manorPurple,
              // headerStyle: {
              //   backgroundColor: Colors.manorBackgroundGray,
              // },
              // headerShadowVisible: false,
              ...TransitionPresets.ModalTransition,
            }}
          />
        </InnerStack.Group>
      </InnerStack.Navigator>
    );
  };

  const ChatNav = () => {
    return (
      <AppProvider>
        <InnerStack.Navigator detachInactiveScreens={false}>
          <InnerStack.Group>
            <InnerStack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={() => ({
                headerShown: false,
              })}
            />
            <InnerStack.Screen
              name="ChatInfoScreen"
              component={ChatInfoScreen}
              options={{
                headerShown: false,
                title: "",
              }}
            />
          </InnerStack.Group>
          <InnerStack.Screen
            name="UsersScreen"
            component={UsersScreen}
            options={{
              headerLeft: () => null,
              headerTitle: "",
              headerBackTitleVisible: false,
              headerTintColor: Colors.manorPurple,
              headerStyle: {
                backgroundColor: Colors.manorBackgroundGray,
              },
              headerShadowVisible: false,
              ...TransitionPresets.ModalTransition,
            }}
          />
          <InnerStack.Screen
            name="AllItemsScreen"
            component={AllItemsScreen}
            options={{
              headerShown: false,
            }}
          />
          <InnerStack.Group screenOptions={{ presentation: "modal" }}>
            <InnerStack.Screen
              name="GoogleFormsScreen"
              component={GoogleFormsScreen}
            />
            <InnerStack.Screen
              name="GoogleMapsScreen"
              component={GoogleMapsScreen}
              options={{
                headerShown: false,
              }}
            />
            <InnerStack.Screen
              name="UnreachedMembersScreen"
              component={UnreachedMembersScreen}
              options={{
                title: "",
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                  backgroundColor: Colors.manorBackgroundGray,
                },
                headerRight: () => (
                  <Pressable style={{ marginRight: "5%" }}>
                    <Text style={{ color: Colors.manorPurple, fontSize: 18 }}>
                      Message All
                    </Text>
                  </Pressable>
                ),
                headerTintColor: Colors.manorPurple,
              }}
            />
          </InnerStack.Group>
        </InnerStack.Navigator>
      </AppProvider>
    );
  };

  const OuterStack = createNativeStackNavigator<OuterAppStackParamList>();

  return (
    <OuterStack.Navigator screenOptions={{ headerShown: false }}>
      <OuterStack.Screen name="ContactNav" component={ContactNav} />
      <OuterStack.Screen name="ChatNav" component={ChatNav} />
    </OuterStack.Navigator>
  );
};
