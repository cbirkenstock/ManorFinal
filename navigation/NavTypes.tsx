import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./Stacks/AuthStack";
import {
  OuterAppStackParamList,
  InnerAppStackParamList,
} from "./Stacks/AppStack";
import { RouteProp } from "@react-navigation/native";

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

export type ChatScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "ChatScreen"
>;

export type UsersScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "UsersScreen"
>;

/* -------------------------- useNavigation Imports ------------------------- */

export type InnerContactScreenNavigationProps = NativeStackNavigationProp<
  InnerAppStackParamList,
  "ContactNav"
>;

export type OuterContactScreenNavigationProps = NativeStackNavigationProp<
  OuterAppStackParamList,
  "ContactNav"
>;

export type OuterUsersScreenNavigationProps = NativeStackNavigationProp<
  OuterAppStackParamList,
  "ContactNav"
>;

/* ---------------------------- UseRoute Imports ---------------------------- */

// export type InnerUsersScreenRouteProps = RouteProp<
//   InnerAppStackParamList,
//   "ContactNav"
// >;
