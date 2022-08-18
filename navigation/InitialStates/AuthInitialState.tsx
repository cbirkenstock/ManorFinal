import { CustomImageData } from "../../managers/MediaManager";
import { User } from "../../src/models";

export interface AuthInitialStateProps {
  loading: boolean;
  user: User | undefined;
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
  user: undefined,
  signUp: () => Promise,
  confirmSignUp: () => Promise,
  signIn: () => Promise,
  signOut: () => Promise,
  setUser: () => Promise,
};
