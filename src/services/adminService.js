import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hàm lấy danh sách nhân viên theo trang  
export const fetchEmployees = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`/employee/listbypage?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách nhân viên:", error.response?.data || error);
    toast.error(`Lỗi tải danh sách: ${error.response?.data?.message || "Lỗi không xác định"}`);
    return { data: [], error: error.response?.data || "Lỗi không xác định" };
  }
};

// Hàm xóa nhân viên theo ID  
export const deleteEmployee = async (employeeId) => {
  try {
    await axiosClient.delete(`/employee/delete/${employeeId}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên:", error);
    throw error;
  }
};

// Thêm nhân viên mới
export const addEmployee = async (employeeData) => {
  try {
    const response = await axiosClient.post("/employee/add", employeeData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm nhân viên:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy danh sách User, Position, Department để chọn trong form
export const fetchUsers = async () => {
  const response = await axiosClient.get("/user/list");
  return response.data;
};

export const fetchPositions = async () => {
  const response = await axiosClient.get("/position/list");
  return response.data;
};

export const fetchDepartments = async () => {
  const response = await axiosClient.get("/department/list");
  return response.data;
};
