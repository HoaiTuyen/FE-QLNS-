import React, { useEffect, useState } from "react";
import { Spin, Empty, Table } from "antd";
import { getSalary, getEmployeeById } from "../../services/userService";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const UserSalary = () => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        // Lấy thông tin nhân viên theo userId
        const employeeRes = await getEmployeeById(user.id);

        // Kiểm tra sự tồn tại của employee và employee.data
        if (!employeeRes || !employeeRes.data) {
          toast.error("Không tìm thấy thông tin nhân viên.");
          return;
        }

        const employeeId = employeeRes.data.id;

        // Lấy thông tin lương của nhân viên
        const res = await getSalary(employeeId);

        if (res?.status === 200) {
          toast.success(res.message);
          setSalary(res.data?.salaries || []);
        } else {
          toast.error("Không có dữ liệu lương.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy lương:", err);
        toast.error("Có lỗi xảy ra khi lấy thông tin lương.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [user.id]);

  const columns = [
    {
      title: "Tên phiếu lương",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Lương cơ bản (VND)",
      dataIndex: "basicSalary",
      key: "basicSalary",
      render: (value) => `${value.toLocaleString("vi-VN")}`,
    },
    {
      title: "Phụ cấp (VND)",
      dataIndex: "allowance",
      key: "allowance",
      render: (value) => `${value.toLocaleString("vi-VN")}`,
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  if (loading) return <Spin />;

  // Hiển thị thông báo khi không có lương
  if (!salary || salary.length === 0) {
    return <Empty description="Không tìm thấy thông tin lương." />;
  }

  return (
    <div>
      <h2>Danh sách lương</h2>
      <Table
        columns={columns}
        dataSource={salary}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default UserSalary;
