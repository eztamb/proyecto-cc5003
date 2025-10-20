import axios from "axios";

const API_URL = "http://localhost:3001/api";

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignupCredentials {
  username: string;
  password: string;
}

interface User {
  username: string;
  id: string;
  role: "admin" | "reviewer";
}

let csrfToken: string | null = null;

const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, {
    withCredentials: true, // enviar cookies
  });

  csrfToken = response.headers["x-csrf-token"];

  return response.data;
};

const signup = async (credentials: SignupCredentials): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, credentials);
  return response.data;
};

const logout = async (): Promise<void> => {
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
  csrfToken = null;
};

const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  });
  return response.data;
};

const getCsrfToken = (): string | null => {
  return csrfToken;
};

export default {
  login,
  signup,
  logout,
  getCurrentUser,
  getCsrfToken,
};
