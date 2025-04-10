import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hàm lấy danh sách nhân viên theo trang
export const fetchEmployees = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(
      `/employee/listbypage?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy danh sách nhân viên:",
      error.response?.data || error
    );
    toast.error(
      `Lỗi tải danh sách: ${
        error.response?.data?.message || "Lỗi không xác định"
      }`
    );
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
    console.log("Dữ liệu gửi tới API:", employeeData);
    const response = await axiosClient.post("/employee/add", employeeData);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi thêm nhân viên:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//Cập nhật thông tin nhân viên
export const updateEmployee = async (employeeData) => {
  try {
    console.log("Dữ liệu nhận được trong updateEmployee:", employeeData); // Log để kiểm tra
    if (!employeeData) {
      throw new Error("employeeData is undefined");
    }
    const response = await axiosClient.put(
      `/employees/${employeeData.id}`,
      employeeData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    throw error;
  }
};

// Lấy danh sách User, Position, Department để chọn trong form
export const fetchUsers = async () => {
  const response = await axiosClient.get("/user/list");
  return response.data;
};

export const fetchUsersNullEmpployee = async () => {
  const response = await axiosClient.get("/user/user-nullemployee");
  return response.data;
};

export const fetchPositions = async () => {
  const response = await axiosClient.get(`/position/list`);
  return response.data;
};

export const fetchPositionsByDepartment = async (positionId) => {
  try {
    const response = await axiosClient.get(`/department/department-position/${positionId}`);
    if (response.data.positions) {
      return response.data.positions; // Trả về mảng positions trực tiếp từ response.data
    } else {
      console.warn("Không tìm thấy positions trong response:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chức vụ theo phòng ban:", error);
    throw error;
  }
};

export const fetchDepartments = async () => {
  const response = await axiosClient.get(`/department/list`);
  return response.data;
};

export const fetchDepartmentsListByPage = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`/department/listbypage?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách phòng ban:", error.response?.data || error);
    toast.error(`Lỗi tải danh sách: ${error.response?.data?.message || "Lỗi không xác định"}`);
    return { data: [], error: error.response?.data || "Lỗi không xác định" };
  }
};

export const addDepartment = async (departmentData) => {
  try {
    console.log("Dữ liệu gửi đi trong addDepartment:", departmentData);
    const response = await axiosClient.post(`/department/add`, departmentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm phòng ban:", error);
    throw error;
  }
};

export const updateDepartment = async (departmentData) => {
  try {
    console.log("Dữ liệu nhận được trong updateDepartment:", departmentData);
    const response = await axiosClient.put(`/department/update/`, departmentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng ban:", error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await axiosClient.delete(`/department/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa phòng ban:", error);
    throw error;
  }
};

export const fetchPositionsListByPage = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`/position/listbypage?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách chức vụ:", error.response?.data || error);
    toast.error(`Lỗi tải danh sách: ${error.response?.data?.message || "Lỗi không xác định"}`);
    return { data: [], error: error.response?.data || "Lỗi không xác định" };
  }
};

export const addPosition = async (positionData) => {
  try {
    console.log("Dữ liệu gửi đi trong addPosition:", positionData);
    const response = await axiosClient.post(`/position/add`, positionData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm phòng ban:", error);
    throw error;
  }
};

export const updatePosition = async (positionData) => {
  try {
    console.log("Dữ liệu nhận được trong updatePosition:", positionData);
    const response = await axiosClient.put(`/position/update/`, positionData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật chức vụ: ", error);
    throw error;
  }
};

export const deletePosition = async (id) => {
  try {
    const response = await axiosClient.delete(`/position/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa chức vụ:", error);
    throw error;
  }
};