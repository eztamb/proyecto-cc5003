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

const CSRF_TOKEN_KEY = "csrfToken";

const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, {
    withCredentials: true, // enviar cookies
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

const getCsrfToken = (): string | null => {
  return localStorage.getItem(CSRF_TOKEN_KEY);
};

export default {
  login,
  signup,
  logout,
  getCurrentUser,
  getCsrfToken,
};
