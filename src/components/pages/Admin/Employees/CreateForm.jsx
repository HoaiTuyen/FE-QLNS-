import * as React from "react";
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
  addEmployee,
  fetchUsers,
  fetchPositions,
  fetchDepartments,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function AddEmployee({ onSuccess }) {
  const [open, setOpen] = React.useState(true);
  const [formData, setFormData] = React.useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    joiningDate: "",
    employeeStatus: "WORKING",
    userId: "", // Sử dụng username thay vì id
    positionId: "",
    departmentId: "",
  });
  const [users, setUsers] = React.useState([]);
  const [positions, setPositions] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const toggleDrawer = () => setOpen(!open);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, positionData, departmentData] = await Promise.all([
          fetchUsers(),
          fetchPositions(),
          fetchDepartments(),
        ]);
        setUsers(userData || []);
        setPositions(positionData || []);
        setDepartments(departmentData || []);
        if (userData?.length)
          setFormData((prev) => ({ ...prev, userId: userData[0].username }));
        if (positionData?.length)
          setFormData((prev) => ({ ...prev, positionId: positionData[0].id }));
        if (departmentData?.length)
          setFormData((prev) => ({
            ...prev,
            departmentId: departmentData[0].id,
          }));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tham chiếu:", error);
        toast.error("Lỗi khi tải dữ liệu tham chiếu");
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const employeeData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        joiningDate: new Date(formData.joiningDate).toISOString(),
      };
      await addEmployee(employeeData);
      toast.success("Thêm nhân viên thành công");
      onSuccess();
      setFormData({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        address: "",
        joiningDate: "",
        employeeStatus: "WORKING",
        userId: users[0]?.username || "",
        positionId: positions[0]?.id || "",
        departmentId: departments[0]?.id || "",
      });
    } catch (error) {
      toast.error(
        "Lỗi khi thêm nhân viên: " +
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
          Thêm Nhân Viên Mới
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
              <MenuItem key="MALE" value="MALE">
                Nam
              </MenuItem>
              <MenuItem key="FEMALE" value="FEMALE">
                Nữ
              </MenuItem>
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
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="employeeStatus"
              value={formData.employeeStatus}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem key="WORKING" value="WORKING">
                Đang làm việc
              </MenuItem>
              <MenuItem key="INACTIVE" value="INACTIVE">
                Nghỉ việc
              </MenuItem>
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
                <MenuItem key={user.username} value={user.username}>
                  {user.username}
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
            >
              {positions.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>
                  {pos.name || pos.id}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Đang thêm..." : "Thêm Nhân Viên"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddEmployee;
