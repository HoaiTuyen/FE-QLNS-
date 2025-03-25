import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/authService";
import { Form, Input, Button, Typography } from "antd";
import { toast } from "react-toastify";

const { Text, Link } = Typography;
const LoginTest = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const resLogin = await loginUser(values.email, values.password);
      if (resLogin.status === 200) {
        localStorage.setItem("user", JSON.stringify(resLogin.data));
        const userType = resLogin.data.type;
        if (userType === "ADMIN") {
          toast.success(resLogin.message);
          navigate("/admin");
        } else {
          toast.success(resLogin.message);
          navigate("/user");
        }
      }
    } catch (error) {
      if (error.response && error.response.status !== 200) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi tạo tài khoản. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const userRegister = await registerUser(
        values.email,
        values.password,
        values.username
      );

      if (userRegister.status === 201) {
        toast.success(userRegister.message);
        setIsLogin(true);
      } else {
        toast.error(userRegister.message);
      }
    } catch (error) {
      if (error.response && error.response.status !== 201) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi tạo tài khoản. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", marginTop: 60 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
      </h2>

      <Form layout="vertical" onFinish={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[{ required: true, message: "Ít nhất 5 kí tự" }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>
        )}

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Text>
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <Link onClick={toggleForm}>
              {isLogin ? "Đăng ký ngay" : "Quay lại đăng nhập"}
            </Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default LoginTest;
