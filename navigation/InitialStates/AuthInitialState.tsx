import { User } from "../../src/models";

export interface AuthInitialStateProps {
  loading: boolean;
  user: User | null;
  signUp: (name: string, phone: string, password: string) => PromiseConstructor;
  confirmSignUp: (phone: string, code: string) => PromiseConstructor;
  signIn: (phone: string, password: string) => PromiseConstructor;
  signOut: (phoneL: string, password: string) => PromiseConstructor;
  setUser: (phone: string, password: string) => PromiseConstructor;
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
