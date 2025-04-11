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
  fetchSalaryById,
  updateSalary,
  fetchEmployees,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdateSalary() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    basicSalary: "",
    allowance: "",
    effectiveDate: "",
    employeeId: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const salary = location.state?.salary;

  const toggleDrawer = () => setOpen(!open);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch danh sách nhân viên
        const empData = await fetchEmployees();
        const empList = empData || [];
        setEmployees(empList);

        // Fetch chi tiết bảng lương
        if (salary?.id) {
          const salaryData = await fetchSalaryById(salary.id);
          setFormData({
            id: salaryData.id || salary.id,
            name: salaryData.name || "",
            basicSalary: salaryData.basicSalary || "",
            allowance: salaryData.allowance || "",
            effectiveDate: salaryData.effectiveDate
              ? salaryData.effectiveDate.split("T")[0]
              : "",
            employeeId: empList.length > 0 ? empList[0].id : "", // Mặc định chọn nhân viên đầu tiên
          });
        } else {
          console.log("Không nhận được salary từ state:", location.state);
          toast.error("Không tìm thấy bảng lương để cập nhật");
          navigate("/salaries");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, [salary, navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const salaryData = {
        id: Number(formData.id),
        name: formData.name.trim(),
        basicSalary: Number(formData.basicSalary),
        allowance: Number(formData.allowance),
        effectiveDate: formData.effectiveDate + "T00:00:00.000Z", // Định dạng ISO
        employeeId: Number(formData.employeeId),
      };
      console.log("Dữ liệu gửi đi trong handleSubmit:", salaryData);
      await updateSalary(salaryData);
      toast.success("Cập nhật bảng lương thành công");
      navigate("/salaries");
    } catch (error) {
      console.error("Lỗi từ server:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(
        "Lỗi khi cập nhật bảng lương: " +
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
          Cập Nhật Bảng Lương
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
            type="number"
            value={formData.basicSalary}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Phụ cấp (tỷ lệ)"
            name="allowance"
            type="number"
            step="0.01"
            value={formData.allowance}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Ngày hiệu lực"
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
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.fullName || emp.id}
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
            {loading ? "Đang cập nhật..." : "Cập Nhật Bảng Lương"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UpdateSalary;
