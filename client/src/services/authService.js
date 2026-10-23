import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async ({ name, email, password }) => {
  const response = await authApi.post("/register", {
    name: name.trim(),
    email: email.trim(),
    password,
  });

  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await authApi.post("/verify-email", {
    token,
  });

  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await authApi.post("/login", {
    email: email.trim(),
    password,
  });

  return response.data;
};

export const forgotPassword = async ({ email }) => {
  const response = await authApi.post("/forgot-password", {
    email: email.trim(),
  });

  return response.data;
};

export const resetPassword = async ({ token, password }) => {
  const response = await authApi.post("/reset-password", {
    token,
    password,
  });

  return response.data;
};

export default authApi;
