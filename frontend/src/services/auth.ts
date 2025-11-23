import axios from "axios";
import type { User } from "../types/types";

const API_URL = "http://localhost:3001/api";

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignupCredentials {
  username: string;
  password: string;
}

const CSRF_TOKEN_KEY = "csrfToken";

const getCsrfToken = (): string | null => {
  return localStorage.getItem(CSRF_TOKEN_KEY);
};

const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, {
    withCredentials: true,
  });

  const token = response.headers["x-csrf-token"];
  if (token) {
    localStorage.setItem(CSRF_TOKEN_KEY, token);
  }

  return response.data;
};

const signup = async (credentials: SignupCredentials): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, credentials);
  return response.data;
};

const logout = async (): Promise<void> => {
  const csrfToken = getCsrfToken();
  await axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      withCredentials: true,
      headers: {
        "X-CSRF-Token": csrfToken || "",
      },
    },
  );
  localStorage.removeItem(CSRF_TOKEN_KEY);
};

const getCurrentUser = async (): Promise<User> => {
  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    return Promise.reject("No CSRF token found");
  }
  const response = await axios.get(`${API_URL}/auth/me`, {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
  return response.data;
};

export default {
  login,
  signup,
  logout,
  getCurrentUser,
  getCsrfToken,
};
