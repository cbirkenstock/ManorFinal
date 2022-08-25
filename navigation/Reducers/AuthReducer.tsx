import { Chat, User } from "../../src/models";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* -------------------------------------------------------------------------- */
/*                                 Action Enum                                */
/* -------------------------------------------------------------------------- */

export enum UserActionCase {
  setUser = "setUser",
}

/* -------------------------------------------------------------------------- */
/*                                Action Types                                */
/* -------------------------------------------------------------------------- */

interface UserAction {
  type: UserActionCase.setUser;
  payload: User | undefined;
}

/* -------------------------------------------------------------------------- */
/*                                 State Type                                 */
/* -------------------------------------------------------------------------- */

interface AppState {
  user: User | undefined;
}

/* -------------------------------------------------------------------------- */
/*                                   Reducer                                  */
/* -------------------------------------------------------------------------- */

function authReducer(state: AppState, action: UserAction) {
  const { type, payload } = action;

  switch (type) {
    case UserActionCase.setUser:
      if (payload) {
        AsyncStorage.setItem("currentUser", JSON.stringify(payload));
      } else {
        AsyncStorage.removeItem("currentUser");
      }

      return {
        ...state,
        user: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in authReducer.`);
  }
}

export default authReducer;
