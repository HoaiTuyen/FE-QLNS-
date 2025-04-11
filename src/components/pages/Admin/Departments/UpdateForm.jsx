import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  fetchDepartmentById,
  updateDepartment,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdateDepartment() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const department = location.state?.department; // Nhận department từ state (danh sách)

  const toggleDrawer = () => setOpen(!open);

  // Fetch dữ liệu phòng ban khi component mount
  useEffect(() => {
    const loadDepartment = async () => {
      if (department?.id) {
        try {
          const data = await fetchDepartmentById(department.id);
          setFormData({
            id: data.id || department.id,
            name: data.name || "",
            description: data.description || "",
          });
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu phòng ban:", error);
          toast.error("Lỗi khi tải dữ liệu phòng ban");
        }
      } else {
        console.log("Không nhận được id phòng ban từ state");
        toast.error("Không tìm thấy phòng ban để cập nhật");
        navigate("/departments");
      }
    };
    loadDepartment();
  }, [department, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const departmentData = {
        id: Number(formData.id), // Gửi id trong body
        name: formData.name,
        description: formData.description,
      };
      console.log("Dữ liệu gửi đi trong handleSubmit:", departmentData);
      await updateDepartment(departmentData);
      toast.success("Cập nhật phòng ban thành công");
      navigate("/departments");
    } catch (error) {
      console.error("Lỗi từ server:", error.response?.data);
      toast.error(
        "Lỗi khi cập nhật phòng ban: " +
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
          Cập Nhật Phòng Ban
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
            disabled // Không cho sửa id
          />
          <TextField
            label="Tên phòng ban"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Đang cập nhật..." : "Cập Nhật Phòng Ban"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UpdateDepartment;
