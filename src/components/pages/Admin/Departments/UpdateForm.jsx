import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { updateDepartment } from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdateDepartment() {
  const [open, setOpen] = React.useState(true);
  const [formData, setFormData] = React.useState({
    id: "",
    name: "",
    description: "",
  });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const department = location.state?.department;

  const toggleDrawer = () => setOpen(!open);

  React.useEffect(() => {
    if (department) {
      setFormData({
        id: department.id || "",
        name: department.name || "",
        description: department.description || "",
      });
    } else {
      console.log("Không nhận được dữ liệu department từ state");
    }
  }, [department]);

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
