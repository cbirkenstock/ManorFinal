import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "../../screens/AuthScreens/SignUpScreen";
import LoginScreen from "../../screens/AuthScreens/LoginScreen";
import ConfirmCodeScreen from "../../screens/AuthScreens/ConfirmCodeScreen";
import { ImageInfo } from "expo-image-picker";

export type AuthStackParamList = {
  SignUpScreen: undefined;
  LoginScreen: undefined;
  ConfirmCodeScreen: {
    phone: string;
    password: string;
    profileImageBlob: Blob;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConfirmCodeScreen"
        component={ConfirmCodeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
