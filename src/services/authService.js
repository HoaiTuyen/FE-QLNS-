import axios from "../utils/axios";

export const loginUser = (email, password) => {
  const res = axios.post("/api/v1/auth/login", {
    email,
    password,
  });

  return res;
};
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
export const registerUser = async (email, password, username) => {
  const res = await axios.post("/api/v1/auth/register", {
    email,
    password,
    username,
    type: "USER",
    status: "ACTIVE",
  });

  return res;
};
export const logout = () => {
  localStorage.removeItem("user");
};
