import React, { useState } from "react";
import { Menu, Layout, Button } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  ApartmentOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserSalary from "../pages/User/UserSalary";
import UserProfile from "../pages/User/UserProfile";
import UserContract from "../pages/User/UserContract";
import UserChangePassword from "../pages/User/UserChangePassword";
import UserDepartment from "../pages/User/UserDepartment";

const { Header, Sider, Content } = Layout;

const UserPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // lấy tên user
  const [selectedTab, setSelectedTab] = useState("profile");

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  const items = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
    },
    {
      key: "contract",
      icon: <FileTextOutlined />,
      label: "Hợp đồng",
    },
    {
      key: "salary",
      icon: <DollarOutlined />,
      label: "Lương & phụ cấp",
    },
    {
      key: "department",
      icon: <ApartmentOutlined />,
      label: "Phòng ban & chức vụ",
    },
    {
      key: "changePassword",
      icon: <LockOutlined />,
      label: "Đổi mật khẩu",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <div style={{ fontWeight: "bold" }}>
          Chào, {user?.username || "User"}
        </div>
        <Button
          icon={<LogoutOutlined />}
          danger
          onClick={handleLogout}
          type="primary"
        >
          Đăng xuất
        </Button>
      </Header>
      <Layout>
        <Sider width={250} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[selectedTab]}
            onClick={(e) => setSelectedTab(e.key)}
            items={items}
            style={{ height: "100%", borderRight: 0 }}
          />
        </Sider>

        <Content style={{ padding: 24 }}>
          {selectedTab === "profile" && <UserProfile />}
          {selectedTab === "contract" && <UserContract />}
          {selectedTab === "salary" && <UserSalary />}
          {selectedTab === "department" && <UserDepartment />}
          {selectedTab === "changePassword" && <UserChangePassword />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserPage;
