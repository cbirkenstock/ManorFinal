import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, Text } from "react-native";
// import ChatInfoScreen from "../../screens/ChatInfoScreen";
// import ChatScreen from "../../screens/ChatScreen";
import ContactScreen from "../../screens/AppScreens/ContactScreen";
// import ProfileScreen from "../../screens/ProfileScreen";
// import UnreachedMembersScreen from "../../screens/UnreachedMembersScreen";
// import UsersScreen from "../../screens/UsersScreen";
// import WebModalScreen from "../../screens/WebModelScreen";
// import GoogleMapsScreen from "../../screens/GoogleMapsScreen";
import Colors from "../../constants/Colors";
import { AppProvider } from "../Providers/AppProvider";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const navigation = useNavigation();

  const ContactNav = () => {
    return (
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="ContactScreen"
            component={ContactScreen}
            options={() => ({
              headerShown: false,
            })}
          />
          {/* <Stack.Screen
            name="UsersScreen"
            component={UsersScreen}
            options={{
              headerShown: true,
              title: "Users",
            }}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              headerShown: false,
              title: "",
              headerBackTitleVisible: true,
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                backgroundColor: "black",
              },
              headerTintColor: Colors.manorPurple,
            }}
          />*/}
        </Stack.Group>
      </Stack.Navigator>
    );
  };

  //   const ChatNav = () => {
  //     return (
  //       <AppProvider>
  //         <Stack.Navigator>
  //           <Stack.Group>
  //             <Stack.Screen
  //               name="ChatScreen"
  //               component={ChatScreen}
  //               options={({ route }) => ({
  //                 headerShown: false,
  //               })}
  //             />
  //             <Stack.Screen
  //               name="ChatInfoScreen"
  //               component={ChatInfoScreen}
  //               options={{
  //                 headerShown: true,
  //                 title: "",
  //               }}
  //             />
  //           </Stack.Group>
  //           <Stack.Group screenOptions={{ presentation: "modal" }}>
  //             <Stack.Screen name="WebModalScreen" component={WebModalScreen} />
  //             <Stack.Screen
  //               name="GoogleMapsScreen"
  //               component={GoogleMapsScreen}
  //             />
  //             <Stack.Screen
  //               name="UnreachedMembersScreen"
  //               component={UnreachedMembersScreen}
  //               options={{
  //                 title: "",
  //                 headerStyle: {
  //                   elevation: 0,
  //                   shadowOpacity: 0,
  //                   borderBottomWidth: 0,
  //                   backgroundColor: Colors.manorBackgroundGray,
  //                 },
  //                 headerRight: () => (
  //                   <Pressable style={{ marginRight: "5%" }}>
  //                     <Text style={{ color: Colors.manorPurple, fontSize: 18 }}>
  //                       Message All
  //                     </Text>
  //                   </Pressable>
  //                 ),
  //                 headerTintColor: Colors.manorPurple,
  //               }}
  //             />
  //           </Stack.Group>
  //         </Stack.Navigator>
  //       </AppProvider>
  //     );
  //   };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContactNav" component={ContactNav} />
      {/* <Stack.Screen name="ChatNav" component={ChatNav} /> */}
    </Stack.Navigator>
  );
};
