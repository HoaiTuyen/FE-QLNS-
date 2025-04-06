import React, { useEffect, useState } from "react";
import { Descriptions, Empty, Spin } from "antd";
import { getEmployeeById } from "../../services/userService";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import EmptyDataFallback from "../common/EmptyDataFallback";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getEmployeeById(user.id);
        if (res.data) {
          setProfile(res.data);
        } else {
          setProfile(null);
          toast.error("Tài khoản chưa có thông tin nhân viên");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("Không tìm thấy thông tin nhân viên.");
        } else {
          toast.error("Lỗi khi lấy thông tin nhân viên.");
        }
        console.error("Lỗi lấy hồ sơ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.id]);

  if (loading) return <Spin />;

  return profile ? (
    <Descriptions
      title="Hồ sơ nhân viên"
      bordered
      column={1}
      styles={{ label: { width: 180 } }}
    >
      <Descriptions.Item label="Họ và tên">
        {profile.fullName || "UnKnow"}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày sinh">
        {profile.dateOfBirth
          ? dayjs(profile.dateOfBirth).format("DD/MM/YYYY")
          : "UnKnow"}
      </Descriptions.Item>
      <Descriptions.Item label="Giới tính">
        {profile.gender === "MALE" ? "Nam" : "Nữ"}
      </Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">
        {profile.phone || "UnKnow"}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ">
        {profile.address || "UnKnow"}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày vào làm">
        {profile.joiningDate
          ? dayjs(profile.joiningDate).format("DD/MM/YYYY")
          : "UnKnow"}
      </Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        {profile.employeeStatus === "WORKING" ? "Đang làm việc" : "Khác"}
      </Descriptions.Item>
    </Descriptions>
  ) : (
    <EmptyDataFallback description="Chưa có thông tin nhân viên" />
  );
};

export default UserProfile;
