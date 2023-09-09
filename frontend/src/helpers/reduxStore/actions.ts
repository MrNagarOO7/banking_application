export const SET_USER_DETAILS = "SET_USER_DETAILS";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  accountNo: string;
  balance: number;
}

export const setUserDetails = (user: User) => {
  return {
    type: SET_USER_DETAILS,
    payload: user,
  };
};
