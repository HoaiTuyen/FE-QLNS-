import axiosClient from "../utils/axios";
//Report

export const fetchCountUser = async () => {
  try {
    const response = await axiosClient.get("/report/users/count");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy số lượng người dùng:", error);
    throw error;
  }
}

export const fetchCountSalary = async () => {
  try {
    const response = await axiosClient.get("/report/salaries/count");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy số lượng bảng lương:", error);
    throw error;
  }
}

export const fetchPositionDetail = async () => {
  try {
    const response = await axiosClient.get("/report/positions/detail");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết chức vụ:", error);
    throw error;
  }
}

export const fetchCountPosition = async () => {
  try {
    const response = await axiosClient.get("/report/positions/count");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy số lượng chức vụ:", error);
    throw error;
  }
}

export const fetchCountEmployee = async () => { 
  try {
    const response = await axiosClient.get("/report/employees/count");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy số lượng nhân viên:", error);
    throw error;
  }
}

export const fetchCountDepartment = async () => {
  try {
    const response = await axiosClient.get("/report/departments/count");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy số lượng phòng ban:", error);
    throw error;
  }
}

export const fetchCountContract = async () => {
  try {
    const response = await axiosClient.get("/report/contracts/count");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy số lượng hợp đồng:", error);
    throw error;
  }
}
