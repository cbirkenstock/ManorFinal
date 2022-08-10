import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "../../screens/AuthScreens/SignUpScreen";
import LoginScreen from "../../screens/AuthScreens/LoginScreen";
import ConfirmCodeScreen from "../../screens/AuthScreens/ConfirmCodeScreen";
import { ImageInfo } from "expo-image-picker";

export type AuthStackParamList = {
  SignUpScreen: undefined;
  LoginScreen: undefined;
  ConfirmCodeScreen: {
    name: string;
    phone: string;
    password: string;
    profileImageData: {
      fullQualityImageMetaData: ImageInfo;
      type: "video" | "image";
      uri: string;
      width: number;
      height: number;
      base64?: string | undefined;
    } | null;
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
