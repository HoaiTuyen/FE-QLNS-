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
import { addSalary, fetchEmployees } from "../../../../services/adminService";
import { toast } from "react-toastify";

function AddSalary() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    basicSalary: "",
    allowance: "",
    effectiveDate: "",
    employeeId: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        const empList = data.employees || data || [];
        setEmployees(empList);
        if (empList.length > 0) {
          setFormData((prev) => ({ ...prev, employeeId: empList[0].id })); // Chọn mặc định
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
        toast.error("Lỗi khi tải danh sách nhân viên");
      }
    };
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const salaryData = {
        name: formData.name,
        basicSalary: formData.basicSalary,
        allowance: formData.allowance,
        effectiveDate: new Date(formData.effectiveDate).toISOString(),
        employeeId: Number(formData.employeeId),
      };
      console.log("Dữ liệu gửi đi:", salaryData);
      await addSalary(salaryData);
      toast.success("Thêm bảng lương thành công");
      navigate("/salaries");
      setFormData({
        name: "",
        basicSalary: "",
        allowance: "",
        effectiveDate: "",
        employeeId: employees[0]?.id || "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm bảng lương:", error.response?.data);
      toast.error(
        "Lỗi khi thêm bảng lương: " +
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
          Thêm Bảng Lương Mới
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Tên bảng lương"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Lương cơ bản"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Tỉ lệ phụ cấp"
            name="allowance"
            value={formData.allowance}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Ngày có hiệu lực"
            name="effectiveDate"
            type="date"
            value={formData.effectiveDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Nhân viên</InputLabel>
            <Select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              label="Nhân viên"
              disabled={employees.length === 0}
            >
              {employees.map((sal) => (
                <MenuItem key={sal.id} value={sal.id}>
                  {sal.fullName || sal.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formData.employeeId}
            sx={{ mt: 2 }}
          >
            {loading ? "Đang thêm..." : "Thêm Bảng Lương"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddSalary;
