import axiosClient from "../utils/axios";
export const loginUser = async (email, password) => {
  const res = await axiosClient.post("/auth/login", {
    email,
    password,
  });
console.log(res);
  return res;
};
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
export const registerUser = async (email, password, username) => {
  const res = await axiosClient.post("/auth/register", {
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
