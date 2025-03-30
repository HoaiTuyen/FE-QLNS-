import axiosClient from "../utils/axios";
export const loginUser = async (email, password) => {
  const res = await axiosClient.post("/api/v1/auth/login", {
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
  const res = await axiosClient.post("/api/v1/auth/register", {
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
export const getAllUserApi = async () => {
  // const axiosAuth = getAxiosWithAuth();
  // const users = await axiosAuth.get("/user/list");
  // console.log(users);

  // return users;

  try {
    const response = await axiosClient.get("/user/list");
    console.log(response);

    console.log("Dữ liệu user:", response.data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ API:", error.response.status, error.response.data);
    } else {
      console.error("Không kết nối được tới API:", error.message);
    }
    throw error;
  }
};
