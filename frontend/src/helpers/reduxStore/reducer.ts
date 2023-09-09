// src/reducers/authReducer.js
import { SET_USER_DETAILS } from "./actions";

const initialState = {
  userDetails: null,
};

const userReducer = (
  state = initialState,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
