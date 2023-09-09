import axios from "axios";
import { config } from "../config";
const api_server = config.api_url;
const AUTH_KEY = "auth-key";

interface SignUpUser {
  fname?: string;
  lname?: string;
  email: string;
  password: string;
}

export const signUp = async (payload: SignUpUser) => {
  try {
    const resp = await axios.post(api_server + "/auth/sign-up", payload, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    console.log(resp.data);
    return resp.data;
  } catch (error: any) {
    console.log("error ==>", error);
    if (error?.response?.data) {
      const msg = error.response.data.message.join(", ");
      error.response.data.msg = msg;
      return error.response.data;
    }
    return { status: false, msg: "Failed to create user." };
  }
};

export const login = async (payload: { email: string; password: string }) => {
  try {
    const resp = await axios.post(api_server + "/auth/sign-in", payload, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    if (resp?.data?.data?.accessToken) {
      localStorage.setItem(AUTH_KEY, resp.data.data.accessToken);
      delete resp.data.data.accessToken;
    }

    return resp.data;
  } catch (error: any) {
    if (error?.response?.data) {
      const msg = error.response.data.message.join(", ");
      error.response.data.msg = msg;
      return error.response.data;
    }
    return { status: false, msg: "Failed to login user." };
  }
};

export const sendOtp = async (payload: { contactNo: string }) => {
  try {
    const resp = await axios.post(api_server + "/auth/send-otp", payload, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    return resp.data;
  } catch (error: any) {
    if (error?.response?.data) {
      const msg = error.response.data.message.join(", ");
      error.response.data.msg = msg;
      return error.response.data;
    }
    return { status: false, msg: "Failed to send otp." };
  }
};

export const verifyOtp = async (payload: {
  contactNo: string;
  loginOtp: string;
}) => {
  try {
    const resp = await axios.post(api_server + "/auth/verify-otp", payload, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    if (resp?.data?.data?.accessToken) {
      localStorage.setItem(AUTH_KEY, resp.data.data.accessToken);
      delete resp.data.data.accessToken;
    }

    return resp.data;
  } catch (error: any) {
    if (error?.response?.data) {
      const msg = error.response.data.message.join(", ");
      error.response.data.msg = msg;
      return error.response.data;
    }
    return { status: false, msg: "Failed to send otp." };
  }
};

export const getTransactions = async (duration = "ministatement") => {
  try {
    const token = localStorage.getItem(AUTH_KEY);
    const url = `${api_server}/transactions?duration=${duration}`;
    const resp = await axios.get(url, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.data;
  } catch (error: any) {
    if (error?.response?.data) {
      const msg = error.response.data.message.join(", ");
      error.response.data.msg = msg;
      return error.response.data;
    }
    return { status: false, msg: "Failed to fetch transactions." };
  }
};

interface Transaction {
  accountNo?: number;
  contactNo?: string;
  amount: number;
}
export const addTransaction = async (transaction: Transaction) => {
  try {
    const token = localStorage.getItem(AUTH_KEY);
    const url = `${api_server}/transactions/`;
    const resp = await axios.post(url, transaction, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.data;
  } catch (error: any) {
    if (error?.response?.data) {
      const msg = error.response.data.message.join(", ");
      error.response.data.msg = msg;
      return error.response.data;
    }
    return { status: false, msg: "Failed to add transaction." };
  }
};

export const cancleTransaction = async (transactionId: string) => {
  try {
    const token = localStorage.getItem(AUTH_KEY);
    const url = `${api_server}/transactions/${transactionId}`;
    const resp = await axios.patch(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return resp.data;
  } catch (error: any) {
    if (error?.response?.data) {
      const msg = error.response.data.message.join(", ");
      error.response.data.msg = msg;
      return error.response.data;
    }
    return { status: false, msg: "Failed to cancle transaction." };
  }
};
