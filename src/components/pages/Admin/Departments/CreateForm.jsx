import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { addDepartment } from "../../../../services/adminService";
import { toast } from "react-toastify";

function AddDepartment() {
  const [open, setOpen] = React.useState(true);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = React.useState(false);
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
      const departmentData = {
        name: formData.name,
        description: formData.description,
      };
      console.log("Dữ liệu gửi đi:", departmentData);
      await addDepartment(departmentData);
      toast.success("Thêm phòng ban thành công");
      navigate("/departments");
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Lỗi khi thêm phòng ban:", error.response?.data);
      toast.error(
        "Lỗi khi thêm phòng ban: " +
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
          Thêm Phòng Ban Mới
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
            {loading ? "Đang thêm..." : "Thêm Phòng Ban"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddDepartment;
