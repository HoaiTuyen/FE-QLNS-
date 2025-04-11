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
import {
  fetchPositionById,
  updatePosition,
  fetchDepartments,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdatePosition() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const position = location.state?.position;

  const toggleDrawer = () => setOpen(!open);

  // Fetch dữ liệu chức vụ và danh sách phòng ban
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch danh sách phòng ban
        const deptData = await fetchDepartments();
        const deptList = deptData.departments || deptData || [];
        setDepartments(deptList);

        // Fetch chi tiết chức vụ
        if (position?.id) {
          const posData = await fetchPositionById(position.id);
          setFormData({
            id: posData.id || position.id,
            name: posData.name || "",
            description: posData.description || "",
            departmentId:
              posData.departmentId ||
              (deptList.length > 0 ? deptList[0].id : ""), // Mặc định chọn phòng ban đầu tiên nếu không có
          });
        } else {
          console.log("Không nhận được position từ state:", location.state);
          toast.error("Không tìm thấy chức vụ để cập nhật");
          navigate("/positions");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, [position, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const positionData = {
        id: Number(formData.id),
        name: formData.name.trim(),
        description: formData.description.trim(),
        departmentId: Number(formData.departmentId), // Lấy từ Select
      };
      //console.log("Dữ liệu gửi đi trong handleSubmit:", positionData);
      await updatePosition(positionData);
      toast.success("Cập nhật chức vụ thành công");
      navigate("/positions");
    } catch (error) {
      console.error("Lỗi từ server:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(
        "Lỗi khi cập nhật chức vụ: " +
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
          Cập Nhật Chức Vụ
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
            {loading ? "Đang cập nhật..." : "Cập Nhật Chức Vụ"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UpdatePosition;
