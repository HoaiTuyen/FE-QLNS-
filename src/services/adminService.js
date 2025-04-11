import axiosClient from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Các hàm xử lý nhân viên

export const fetchEmployees = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(
      `/employee/listbypage?page=${page}&size=${size}`
    );
    //console.log("Dữ liệu từ fetchEmployees:", response.data);
    return response.data.employees || response.data;
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

export const fetchEmployeeById = async (id) => {
  try {
    const response = await axiosClient.get(`/employee/${id}`);
    console.log("Dữ liệu từ fetchEmployeeById:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết nhân viên:", error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    await axiosClient.delete(`/employee/delete/${employeeId}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên:", error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    //console.log("Dữ liệu gửi tới API:", employeeData);
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

export const updateEmployee = async (employeeData) => {
  try {
    console.log("Dữ liệu gửi đi trong updateEmployee:", employeeData);
    const response = await axiosClient.put(`/employee/update`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
    throw error;
  }
};

export const fetchUsersNullEmployee = async () => {
  const response = await axiosClient.get("/user/user-nullemployee");
  return response.data;
};

// Các hàm xử lý phòng ban

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

export const fetchDepartmentById = async (id) => {
  try {
    const response = await axiosClient.get(`department/${id}`);
    //console.log("Dữ liệu từ fetchDepartmentById:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết phòng ban:", error);
    throw error;
  }
};

export const addDepartment = async (departmentData) => {
  try {
    //console.log("Dữ liệu gửi đi trong addDepartment:", departmentData);
    const response = await axiosClient.post(`/department/add`, departmentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm phòng ban:", error);
    throw error;
  }
};

export const updateDepartment = async (departmentData) => {
  try {
    //console.log("Dữ liệu nhận được trong updateDepartment:", departmentData);
    const response = await axiosClient.put(`/department/update`, departmentData);
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

// Các hàm xử lý chức vụ

export const fetchPositions = async () => {
  const response = await axiosClient.get(`/position/list`);
  return response.data;
};

export const fetchPositionById = async (id) => {
  try {
    const response = await axiosClient.get(`/position/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết chức vụ:", error);
    throw error;
  }
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
    //console.log("Dữ liệu gửi đi trong addPosition:", positionData);
    const response = await axiosClient.post(`/position/add`, positionData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm phòng ban:", error);
    throw error;
  }
};

export const updatePosition = async (positionData) => {
  try {
    //console.log("Dữ liệu nhận được trong updatePosition:", positionData);
    const response = await axiosClient.put(`/position/update`, positionData);
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

// Các hàm xử lý bảng lương

export const fetchSalaries = async () => {
  const response = await axiosClient.get(`/salary/list`);
  return response.data;
};

export const fetchSalaryById = async (id) => {
  try {
    const response = await axiosClient.get(`/salary/${id}`);
    console.log("Dữ liệu từ fetchSalaryById:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bảng lương:", error);
    throw error;
  }
};

export const fetchSalariesListByPage = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`/salary/listbypage?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách bảng lương:", error.response?.data || error);
    toast.error(`Lỗi tải danh sách: ${error.response?.data?.message || "Lỗi không xác định"}`);
    return { data: [], error: error.response?.data || "Lỗi không xác định" };
  }
};

export const addSalary = async (salaryData) => {
  try {
    //console.log("Dữ liệu gửi đi trong addSalary:", salaryData);
    const response = await axiosClient.post(`/salary/add`, salaryData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm bảng lương:", error);
    throw error;
  }
};

export const updateSalary = async (salaryData) => {
  try {
    console.log("Dữ liệu nhận được trong updateSalary:", salaryData);
    const response = await axiosClient.put(`/salary/update`, salaryData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật chức vụ: ", error);
    throw error;
  }
};

export const deleteSalary = async (id) => {
  try {
    const response = await axiosClient.delete(`/salary/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa chức vụ:", error);
    throw error;
  }
};

// Các hàm xử lý người dùng

export const fetchUsers = async () => {
  const response = await axiosClient.get("/user/list");
  return response.data;
};

export const fetchUserById = async (id) => {
  try {
    const response = await axiosClient.get(`/user/${id}`);
    console.log("Dữ liệu từ fetchUserById:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết user:", error);
    throw error;
  }
};

export const fetchUsersListByPage = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`/user/listbypage?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách bảng lương:", error.response?.data || error);
    toast.error(`Lỗi tải danh sách: ${error.response?.data?.message || "Lỗi không xác định"}`);
    return { data: [], error: error.response?.data || "Lỗi không xác định" };
  }
};

export const addUser = async (userData) => {
  try {
    //console.log("Dữ liệu gửi đi trong addUser:", userData);
    const response = await axiosClient.post(`/user/add`, userData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    console.log("Dữ liệu nhận được trong updateUser:", userData);
    const response = await axiosClient.put(`/user/update`, userData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng: ", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosClient.delete(`/user/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw error;
  }
};

// Các hàm xử lý hợp đồng

export const fetchContracts = async () => {
  const response = await axiosClient.get("/contract/list");
  return response.data;
};

export const fetchContractById = async (id) => {
  try {
    const response = await axiosClient.get(`/contract/${id}`);
    //console.log("Dữ liệu từ fetchContractById:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hợp đồng:", error);
    throw error;
  }
};

export const fetchContractsListByPage = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`/contract/listbypage?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách hợp đồng:", error.response?.data || error);
    toast.error(`Lỗi tải danh sách: ${error.response?.data?.message || "Lỗi không xác định"}`);
    return { data: [], error: error.response?.data || "Lỗi không xác định" };
  }
};

export const addContract = async (contractData) => {
  try {
    //console.log("Dữ liệu gửi đi trong addContract:", contractData);
    const response = await axiosClient.post(`/contract/add`, contractData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm hợp đồng:", error);
    throw error;
  }
};

export const updateContract = async (contractData) => {
  try {
    //console.log("Dữ liệu nhận được trong updateContract:", contractData);
    const response = await axiosClient.put(`/contract/update`, contractData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật hợp đồng: ", error);
    throw error;
  }
};

export const deleteContract = async (id) => {
  try {
    const response = await axiosClient.delete(`/contract/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa hợp đồng:", error);
    throw error;
  }
};