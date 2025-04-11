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
import { addContract, fetchEmployees } from "../../../../services/adminService";
import { toast } from "react-toastify";

function AddContract() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    contractType: "",
    startDate: "",
    endDate: "",
    notes: "",
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
        console.error("Lỗi khi tải danh sách nhân viên", error);
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
      const contractData = {
        contractType: formData.contractType,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        notes: formData.notes,
        employeeId: Number(formData.employeeId),
      };
      console.log("Dữ liệu gửi đi:", contractData);
      await addContract(contractData);
      toast.success("Thêm hợp đồng thành công");
      navigate("/contracts");
      setFormData({
        contractType: "",
        startDate: "",
        endDate: "",
        notes: "",
        employeeId: employees[0]?.id || "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm hợp đồng:", error.response?.data);
      toast.error(
        "Lỗi khi thêm hợp đồng: " +
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
          Thêm Hợp Đồng Mới
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl fullWidth required>
            <InputLabel>Loại hợp đồng</InputLabel>
            <Select
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              label="Loại hợp đồng"
            >
              <MenuItem value="OFFICIAL">Chính thức</MenuItem>
              <MenuItem value="PROBATION">Thử việc</MenuItem>
              <MenuItem value="INTERN">Thực tập</MenuItem>
              <MenuItem value="PART_TIME">Thời vụ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ngày bắt đầu"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Ngày kết thúc"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Ghi chú"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Nhập ghi chú"
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
            {loading ? "Đang thêm..." : "Thêm Hợp Đồng"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddContract;
