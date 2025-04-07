import * as React from "react";
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
  updateEmployee,
  fetchUsers, // Sử dụng fetchUsers hoặc fetchAvailableUsers
  fetchDepartments,
  fetchPositionsByDepartment,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdateEmployee() {
  const [open, setOpen] = React.useState(true);
  const [formData, setFormData] = React.useState({
    id: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    joiningDate: "",
    employeeStatus: "WORKING",
    userId: "",
    positionId: "",
    departmentId: "",
  });
  const [users, setUsers] = React.useState([]);
  const [positions, setPositions] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const employee = location.state?.employee;

  const toggleDrawer = () => setOpen(!open);

  // Điền dữ liệu nhân viên từ state
  React.useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id || "",
        fullName: employee.fullName || "",
        dateOfBirth: employee.dateOfBirth
          ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: employee.gender || "",
        phone: employee.phone || "",
        address: employee.address || "",
        joiningDate: employee.joiningDate
          ? new Date(employee.joiningDate).toISOString().split("T")[0]
          : "",
        employeeStatus: employee.employeeStatus || "WORKING",
        userId: employee.userId || "",
        positionId: employee.positionId || "",
        departmentId: employee.departmentId || "",
      });
    } else {
      console.log("Không nhận được dữ liệu employee từ state");
    }
  }, [employee]);

  // Tải dữ liệu tham chiếu ban đầu
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, departmentData] = await Promise.all([
          fetchUsers(), // Hoặc fetchAvailableUsers(employee?.userId) nếu có API
          fetchDepartments(),
        ]);

        // Lọc user đã sử dụng, giữ lại user hiện tại
        const currentUserId = employee?.userId;
        const filteredUsers = userData.filter(
          (user) => !user.isAssigned || user.id === currentUserId // Giả định có trường isAssigned
        );
        setUsers(filteredUsers || []);

        setDepartments(departmentData || []);

        // Tải positions ban đầu dựa trên departmentId
        if (employee?.departmentId) {
          const positionData = await fetchPositionsByDepartment(
            employee.departmentId
          );
          console.log("Danh sách chức vụ ban đầu:", positionData);
          setPositions(positionData || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tham chiếu:", error);
        toast.error("Lỗi khi tải dữ liệu tham chiếu");
      }
    };
    loadData();
  }, [employee]);

  // Cập nhật positions khi departmentId thay đổi
  React.useEffect(() => {
    const loadPositions = async () => {
      if (formData.departmentId) {
        try {
          const positionData = await fetchPositionsByDepartment(
            formData.departmentId
          );
          console.log("Danh sách chức vụ nhận được:", positionData);
          setPositions(positionData || []);
          if (
            positionData?.length &&
            !positionData.some((pos) => pos.id === formData.positionId)
          ) {
            setFormData((prev) => ({
              ...prev,
              positionId: positionData[0].id,
            }));
          }
        } catch (error) {
          console.error("Lỗi khi tải danh sách chức vụ:", error);
          toast.error("Lỗi khi tải danh sách chức vụ");
        }
      } else {
        setPositions([]);
        setFormData((prev) => ({ ...prev, positionId: "" }));
      }
    };
    loadPositions();
  }, [formData.departmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const employeeData = {
        id: Number(formData.id),
        fullName: formData.fullName,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        joiningDate: new Date(formData.joiningDate).toISOString(),
        employeeStatus: formData.employeeStatus,
        userId: Number(formData.userId),
        positionId: Number(formData.positionId),
      };
      console.log("Dữ liệu gửi đi:", employeeData);
      await updateEmployee(employeeData);
      toast.success("Cập nhật nhân viên thành công");
      navigate("/employees");
    } catch (error) {
      console.error("Lỗi từ server:", error.response?.data);
      toast.error(
        "Lỗi khi cập nhật nhân viên: " +
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
          Cập Nhật Nhân Viên
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Họ và Tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Giới tính</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Giới tính"
            >
              <MenuItem value="MALE">Nam</MenuItem>
              <MenuItem value="FEMALE">Nữ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Ngày vào làm"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled
          />
          <FormControl fullWidth required>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="employeeStatus"
              value={formData.employeeStatus}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="WORKING">Đang làm việc</MenuItem>
              <MenuItem value="INACTIVE">Nghỉ việc</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>User</InputLabel>
            <Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              label="User"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username || user.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Phòng ban</InputLabel>
            <Select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              label="Phòng ban"
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name || dept.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Chức vụ</InputLabel>
            <Select
              name="positionId"
              value={formData.positionId}
              onChange={handleChange}
              label="Chức vụ"
              disabled={!formData.departmentId}
            >
              {positions.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>
                  {pos.name || pos.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Đang cập nhật..." : "Cập Nhật Nhân Viên"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UpdateEmployee;
