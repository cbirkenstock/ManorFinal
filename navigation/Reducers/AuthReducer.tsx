import { User } from "../../src/models";

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
  type: UserActionCase;
  payload: User | null;
}

/* -------------------------------------------------------------------------- */
/*                                 State Type                                 */
/* -------------------------------------------------------------------------- */

interface AppState {
  user: User | null;
}

/* -------------------------------------------------------------------------- */
/*                                   Reducer                                  */
/* -------------------------------------------------------------------------- */

function authReducer(state: AppState, action: UserAction) {
  const { type, payload } = action;

  switch (type) {
    case UserActionCase.setUser:
      return {
        ...state,
        user: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in authReducer.`);
  }
}

export default authReducer;