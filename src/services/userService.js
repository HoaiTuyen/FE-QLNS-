import axiosClient from "../utils/axios";

export const getEmployeeById = async (userId) => {
  return axiosClient.get(`/employee/employee-detail/${userId}`);
};
export const getSalary = async (userId) => {
  return await axiosClient.get(`/employee/employee-salary/${userId}`);
};
export const getContract = async (userId) => {
  return await axiosClient.get(`/employee/employee-contract/${userId}`);
};
export const changePassword = async (dataBody) => {
  return await axiosClient.post(`/auth/change-password`, dataBody);
};
