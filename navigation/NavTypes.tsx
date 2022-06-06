import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./Stacks/AuthStack";
import {
  OuterAppStackParamList,
  InnerAppStackParamList,
} from "./Stacks/AppStack";

/* -------------------------------------------------------------------------- */
/*                                Auth Screens                                */
/* -------------------------------------------------------------------------- */

export type ConfirmCodeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ConfirmCodeScreen"
>;
export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "LoginScreen"
>;
export type SignUpScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "SignUpScreen"
>;

/* -------------------------------------------------------------------------- */
/*                                 App Screens                                */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Full Screens ------------------------------ */

export type ContactScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "ContactScreen"
>;

export type ProfileScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "ProfileScreen"
>;

/* -------------------------- useNavigation Imports ------------------------- */

export type InnerContactScreenNavigationProp = NativeStackNavigationProp<
  InnerAppStackParamList,
  "ContactNav"
>;

export type OuterContactScreenNavigationProp = NativeStackNavigationProp<
  OuterAppStackParamList,
  "ContactNav"
>;
