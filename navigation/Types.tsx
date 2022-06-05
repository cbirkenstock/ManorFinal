import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/Stacks/AuthStack";

export type ConfirmCodeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ConfirmCodeScreen"
>;
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "LoginScreen"
>;
export type SignUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SignUpScreen"
>;
