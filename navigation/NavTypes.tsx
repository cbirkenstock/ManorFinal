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

export type ChatInfoScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "ChatInfoScreen"
>;

export type UsersScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "UsersScreen"
>;

export type GoogleMapsScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "GoogleMapsScreen"
>;

export type GoogleFormsScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "GoogleFormsScreen"
>;

export type UnreachedMembersScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "UnreachedMembersScreen"
>;

export type AllItemsScreenProps = NativeStackScreenProps<
  InnerAppStackParamList,
  "AllItemsScreen"
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

export type InnerCreateEventFormNavigationProps = NativeStackNavigationProp<
  InnerAppStackParamList,
  "ContactNav"
>;

export type InnerEventCardNavigationProps = NativeStackNavigationProp<
  InnerAppStackParamList,
  "ContactNav"
>;

export type InnerAnnouncementProps = NativeStackNavigationProp<
  InnerAppStackParamList,
  "ContactNav"
>;

/* ---------------------------- UseRoute Imports ---------------------------- */

// export type InnerUsersScreenRouteProps = RouteProp<
//   InnerAppStackParamList,
//   "ContactNav"
// >;
