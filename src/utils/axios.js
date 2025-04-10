import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    "https://backend-service-dch2hyfvavfecjea.southeastasia-01.azurewebsites.net/api/v1",
});

axiosClient.interceptors.request.use((config) => {
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (user?.email && user?.password) {
      const token = btoa(`${user.email}:${user.password}`);

      config.headers.Authorization = `Basic ${token}`;
    }
  } catch (error) {
    console.warn("Không thể parse localStorage user:", error);
  }
  return config;
});

// Tự động lấy response.data
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Gợi ý: Bạn có thể xử lý lỗi chung ở đây
    console.error(
      "Phản hồi lỗi từ server:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosClient;
