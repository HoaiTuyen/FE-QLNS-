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
  fetchContractById,
  updateContract,
  fetchEmployees,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdateContract() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    contractType: "",
    startDate: "",
    endDate: "",
    notes: "",
    employeeId: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const contract = location.state?.contract;

  const toggleDrawer = () => setOpen(!open);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch danh sách nhân viên
        const empData = await fetchEmployees();
        const empList = Array.isArray(empData)
          ? empData
          : empData.content || [];
        setEmployees(empList);

        // Fetch chi tiết hợp đồng
        if (contract?.id) {
          const contractData = await fetchContractById(contract.id);
          setFormData({
            id: contractData.id || contract.id,
            contractType: contractData.contractType || "PROBATION",
            startDate: contractData.startDate
              ? contractData.startDate.split("T")[0]
              : "",
            endDate: contractData.endDate
              ? contractData.endDate.split("T")[0]
              : "",
            notes: contractData.notes || "",
            employeeId: empList.length > 0 ? empList[0].id : "", // Mặc định chọn nhân viên đầu tiên
          });
        } else {
          console.log("Không nhận được contract từ state:", location.state);
          toast.error("Không tìm thấy hợp đồng để cập nhật");
          navigate("/contracts");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, [contract, navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contractData = {
        id: Number(formData.id),
        contractType: formData.contractType,
        startDate: formData.startDate + "T00:00:00.000Z",
        endDate: formData.endDate + "T00:00:00.000Z",
        notes: formData.notes.trim(),
        employeeId: Number(formData.employeeId),
      };
      console.log("Dữ liệu gửi đi trong handleSubmit:", contractData);
      await updateContract(contractData);
      toast.success("Cập nhật hợp đồng thành công");
      navigate("/contracts");
    } catch (error) {
      console.error("Lỗi từ server:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(
        "Lỗi khi cập nhật hợp đồng: " +
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
          Cập Nhật Hợp Đồng
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
          <FormControl fullWidth required>
            <InputLabel>Loại hợp đồng</InputLabel>
            <Select
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              label="Loại hợp đồng"
            >
              <MenuItem value="PROBATION">Thử việc</MenuItem>
              <MenuItem value="OFFICIAL">Chính thức</MenuItem>
              <MenuItem value="PART_TIME">Tạm thời</MenuItem>
              <MenuItem value="INTERN">Thực tập sinh</MenuItem>
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
            multiline
            rows={4}
            onChange={handleChange}
            fullWidth
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
            {loading ? "Đang cập nhật..." : "Cập Nhật Hợp Đồng"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UpdateContract;
