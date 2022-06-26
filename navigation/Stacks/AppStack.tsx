import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
// import ChatInfoScreen from "../../screens/ChatInfoScreen";
// import ChatScreen from "../../screens/ChatScreen";
import ContactScreen from "../../screens/AppScreens/ContactScreen";
import ProfileScreen from "../../screens/AppScreens/ProfileScreen";
import ChatScreen from "../../screens/AppScreens/ChatScreen";
// import UnreachedMembersScreen from "../../screens/UnreachedMembersScreen";
import UsersScreen, { ChatEnum } from "../../screens/AppScreens/UsersScreen";
// import WebModalScreen from "../../screens/WebModelScreen";
// import GoogleMapsScreen from "../../screens/GoogleMapsScreen";
import Colors from "../../constants/Colors";
import { AppProvider } from "../Providers/AppProvider";
import { Chat, ChatUser } from "../../src/models";
import { NavigatorScreenParams } from "@react-navigation/native";

export type InnerAppStackParamList = {
  ContactNav: undefined;
  ChatNav: undefined;
  ContactScreen: undefined;
  ProfileScreen: undefined;
  ChatScreen: {
    chat: Chat;
    chatUser: ChatUser;
    members: ChatUser[] | undefined;
  };
  UsersScreen: { chatType: ChatEnum };
};

export type OuterAppStackParamList = {
  ContactNav: NavigatorScreenParams<InnerAppStackParamList>;
  ChatNav: NavigatorScreenParams<InnerAppStackParamList>;
};

const InnerStack = createNativeStackNavigator<InnerAppStackParamList>();

export const AppStack = () => {
  // const navigation = useNavigation();

  const ContactNav = () => {
    return (
      <InnerStack.Navigator>
        <InnerStack.Group>
          <InnerStack.Screen
            name="ContactScreen"
            component={ContactScreen}
            options={() => ({
              headerShown: false,
            })}
          />
        </InnerStack.Group>
        <InnerStack.Group screenOptions={{ presentation: "modal" }}>
          <InnerStack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
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
              headerTitle: "",
              headerBackTitleVisible: false,
              headerTintColor: Colors.manorPurple,
              headerStyle: {
                backgroundColor: Colors.manorBackgroundGray,
              },
              headerShadowVisible: false,
            }}
          />
        </InnerStack.Group>
      </InnerStack.Navigator>
    );
  };

  const ChatNav = () => {
    return (
      <AppProvider>
        <InnerStack.Navigator>
          <InnerStack.Group>
            <InnerStack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={() => ({
                headerShown: false,
              })}
            />
            {/* <Stack.Screen
              name="ChatInfoScreen"
              component={ChatInfoScreen}
              options={{
                headerShown: true,
                title: "",
              }}
            /> */}
          </InnerStack.Group>
          {/* <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="WebModalScreen" component={WebModalScreen} />
            <Stack.Screen
              name="GoogleMapsScreen"
              component={GoogleMapsScreen}
            />
            <Stack.Screen
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
          </Stack.Group> */}
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
