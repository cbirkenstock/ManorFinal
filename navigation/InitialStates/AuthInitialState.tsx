import { User } from "../../src/models";

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
  ) => Promise<void> | PromiseConstructor;
  signIn: (
    phone: string,
    password: string
  ) => Promise<void> | PromiseConstructor;
  signOut: (
    phone: string,
    password: string
  ) => Promise<void> | PromiseConstructor;
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
