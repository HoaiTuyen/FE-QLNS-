import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { getContract, getDetailUser } from "../../../services/userService";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import EmptyDataFallback from "../../common/EmptyDataFallback";

const UserContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const employeeRes = await getDetailUser(user.email);

        if (employeeRes?.data?.employee?.id) {
          const employeeId = employeeRes.data.employee.id;
          const contractRes = await getContract(employeeId);
          const contractList = contractRes.data?.contracts || [];
          setContracts(contractList);
          toast.success(contractRes.message || "Success");
        }
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user.id]);

  const columns = [
    {
      title: "Loại hợp đồng",
      dataIndex: "contractType",
      key: "contractType",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  if (loading) return <Spin />;

  return contracts.length > 0 ? (
    <div>
      <h2>Danh sách hợp đồng</h2>
      <Table
        columns={columns}
        dataSource={contracts}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  ) : (
    <EmptyDataFallback description="Chưa có hợp đồng của nhân viên" />
  );
};

export default UserContract;
