import { useState, useEffect } from "react";
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
import {
  addPosition,
  fetchDepartments,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function AddPosition() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartments();
        const deptList = data.departments || data || [];
        setDepartments(deptList);
        if (deptList.length > 0) {
          setFormData((prev) => ({ ...prev, departmentId: deptList[0].id })); // Chọn mặc định
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng ban:", error);
        toast.error("Lỗi khi tải danh sách phòng ban");
      }
    };
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const positionData = {
        name: formData.name,
        description: formData.description,
        departmentId: Number(formData.departmentId),
      };
      console.log("Dữ liệu gửi đi:", positionData);
      await addPosition(positionData);
      toast.success("Thêm chức vụ thành công");
      navigate("/positions");
      setFormData({
        name: "",
        description: "",
        departmentId: departments[0]?.id || "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm chức vụ:", error.response?.data);
      toast.error(
        "Lỗi khi thêm chức vụ: " +
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
          Thêm Chức Vụ Mới
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Tên chức vụ"
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
          <FormControl fullWidth required>
            <InputLabel>Phòng ban</InputLabel>
            <Select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              label="Phòng ban"
              disabled={departments.length === 0}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name || dept.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formData.departmentId}
            sx={{ mt: 2 }}
          >
            {loading ? "Đang thêm..." : "Thêm Chức Vụ"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddPosition;
