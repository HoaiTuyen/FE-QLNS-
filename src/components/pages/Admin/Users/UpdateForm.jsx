import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { fetchUserById, updateUser } from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdateUser() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    type: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user;

  const toggleDrawer = () => setOpen(!open);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.id) {
          const userData = await fetchUserById(user.id);
          setFormData({
            id: userData.id || user.id,
            username: userData.username || "",
            email: userData.email || "",
            type: userData.type || "USER",
            status: userData.status || "ACTIVE",
          });
        } else {
          console.log("Không nhận được user từ state:", location.state);
          toast.error("Không tìm thấy user để cập nhật");
          navigate("/users");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, [user, navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        email: formData.email.trim(),
        type: formData.type,
        status: formData.status,
      };
      console.log("Dữ liệu gửi đi trong handleSubmit:", userData);
      await updateUser(userData);
      toast.success("Cập nhật user thành công");
      navigate("/users");
    } catch (error) {
      console.error("Lỗi từ server:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(
        "Lỗi khi cập nhật user: " +
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
          Cập Nhật User
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="ID"
            name="id"
            value={formData.id}
            fullWidth
            disabled
          />
          <TextField
            label="Tên đăng nhập"
            name="username"
            value={formData.username}
            fullWidth
            disabled // Không gửi username trong API update
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Loại</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Loại"
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
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
              <MenuItem value="ACTIVE">Hoạt động</MenuItem>
              <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Đang cập nhật..." : "Cập Nhật User"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UpdateUser;
