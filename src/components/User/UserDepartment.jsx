import React, { useState, useEffect } from "react";
import { Descriptions, Spin } from "antd";
import { toast } from "react-toastify";
import { getEmployeeById } from "../../services/userService"; // Giả sử bạn có hàm này trong userService.js

const UserDepartment = () => {
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(null);
  const [department, setDepartment] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserDepartment = async () => {
      try {
        // Lấy dữ liệu nhân viên từ API
        const res = await getEmployeeById(user.id);

        // Kiểm tra và lấy vị trí và phòng ban
        if (res?.data) {
          setPosition(res.data.position);
          setDepartment(res.data.department);
          toast.success("Information successfully");
        } else {
          toast.error("Không tìm thấy thông tin.");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("Không có thông tin phòng ban và chức vụ");
        } else {
          console.error("Lỗi khi lấy thông tin:", err);
          toast.error("Lỗi khi lấy thông tin.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDepartment();
  }, [user.id]);

  if (loading) return <Spin />;

  return (
    <div>
      <h2>Thông tin Vị trí và Phòng ban</h2>
      <Descriptions bordered column={1}>
        {position && (
          <Descriptions.Item label="Vị trí">{position.name}</Descriptions.Item>
        )}
        {department && (
          <Descriptions.Item label="Phòng ban">
            {department.name}
          </Descriptions.Item>
        )}
      </Descriptions>
    </div>
  );
};

export default UserDepartment;
