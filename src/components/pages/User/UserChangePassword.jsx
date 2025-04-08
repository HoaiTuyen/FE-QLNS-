import React from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { changePassword } from "../../../services/userService";

const UserChangePassword = () => {
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.warning("The confirmation password does not match.");
      return;
    }
    const data = {
      email: user.email,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    try {
      const changePass = await changePassword(data);
      if (changePass.status === 200) {
        toast.success(changePass.message);
        form.resetFields();
      } else {
        toast.error(changePass.message || "Password change failed.");
      }
    } catch (e) {
      console.error("Password change failed.", e);
      toast.error(e.response?.data?.message || "Password change failed.");
    }
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Đổi mật khẩu</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleChangePassword}
        autoComplete="off"
      >
        <Form.Item label="Email" name="email" initialValue={user.email}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="oldPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UserChangePassword;
