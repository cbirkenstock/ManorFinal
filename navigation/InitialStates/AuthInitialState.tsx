import { ImageInfo } from "expo-image-picker";
import { CustomImageData } from "../../managers/MediaManager";
import { Chat, User } from "../../src/models";

export interface AuthInitialStateProps {
  loading: boolean;
  user: User | null;
  signUp: (
    name: string,
    phone: string,
    password: string
  ) => Promise<void> | PromiseConstructor;
  confirmSignUp: (
    phone: string,
    code: string
  ) => Promise<any> | PromiseConstructor;
  signIn: (
    phone: string,
    password: string,
    name?: string,
    profileImageData?: CustomImageData
  ) => Promise<any> | PromiseConstructor;
  signOut: () => Promise<void> | PromiseConstructor;
  setUser: (user: User) => Promise<void> | PromiseConstructor;
}

export const initialState = {
  loading: true,
  user: null,
  signUp: () => Promise,
  confirmSignUp: () => Promise,
  signIn: () => Promise,
  signOut: () => Promise,
  setUser: () => Promise,
};
