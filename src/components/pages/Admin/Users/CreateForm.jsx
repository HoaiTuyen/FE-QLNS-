import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { addUser } from "../../../../services/adminService";
import { toast } from "react-toastify";

function AddUser() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    type: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        type: formData.type,
        status: formData.status,
      };
      console.log("Dữ liệu gửi đi:", userData);
      await addUser(userData);
      toast.success("Thêm người dùng thành công");
      navigate("/users");
      setFormData({
        username: "",
        password: "",
        email: "",
        type: "",
        status: "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error.response?.data);
      toast.error(
        "Lỗi khi thêm người dùng: " +
          (error.response?.data?.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Container
        maxWidth="md"
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: open ? "240px" : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Thêm Người Dùng Mới
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Tên người dùng"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Loại tài khoản</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Loại tài khoản"
            >
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
              <MenuItem value="USER">Người dùng</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="ACTIVE">Kích hoạt</MenuItem>
              <MenuItem value="INACTIVE">Vô hiệu hóa</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              loading ||
              !formData.username ||
              !formData.password ||
              !formData.email ||
              !formData.type ||
              !formData.status
            }
            sx={{ mt: 2 }}
          >
            {loading ? "Đang thêm..." : "Thêm Người Dùng"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddUser;
