import React, { useState, useEffect } from "react";
import { Descriptions, Spin } from "antd";
import { toast } from "react-toastify";
import { getEmployeeById } from "../../../services/userService"; // Giả sử bạn có hàm này trong userService.js
import EmptyDataFallback from "../../common/EmptyDataFallback";
const UserDepartment = () => {
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(null);
  const [department, setDepartment] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserDepartment = async () => {
      try {
        const res = await getEmployeeById(user.id);
        console.log(res);

        if (res?.data) {
          setPosition(res.data.position);
          setDepartment(res.data.department);
          toast.success(res.message);
        } else {
          toast.error("Không tìm thấy thông tin.");
        }
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDepartment();
  }, [user.id]);

  if (loading) return <Spin />;
  if (!department || !position) {
    return (
      <EmptyDataFallback description="Không tìm thấy thông phòng ban & chức vụ." />
    );
  }
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
