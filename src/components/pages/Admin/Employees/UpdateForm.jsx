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
  fetchEmployeeById,
  updateEmployee,
  fetchUsersNullEmployee,
  fetchUserById,
  fetchDepartments,
  fetchPositionsByDepartment,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function UpdateEmployee() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    joiningDate: "",
    employeeStatus: "",
    userId: "",
    departmentId: "",
    positionId: "",
  });
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const employee = location.state?.employee;

  const toggleDrawer = () => setOpen(!open);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch danh sách user chưa sử dụng
        const userNullData = await fetchUsersNullEmployee();
        let userList = userNullData || [];

        // Fetch danh sách phòng ban
        const deptData = await fetchDepartments();
        const deptList = deptData.departments || deptData || [];
        setDepartments(deptList);

        // Fetch chi tiết nhân viên và user hiện tại
        if (employee?.id) {
          const empData = await fetchEmployeeById(employee.id);
          setFormData({
            id: empData.id || employee.id,
            fullName: empData.fullName || "",
            dateOfBirth: empData.dateOfBirth
              ? empData.dateOfBirth.split("T")[0]
              : "",
            gender: empData.gender || "MALE",
            phone: empData.phone || "",
            address: empData.address || "",
            joiningDate: empData.joiningDate
              ? empData.joiningDate.split("T")[0]
              : "",
            employeeStatus: empData.employeeStatus || "WORKING",
            userId: empData.userId || "",
            departmentId: "",
            positionId: empData.positionId || "",
          });
          console.log("Dữ liệu empData.userID:", empData.userID);

          // Fetch user hiện tại và gộp vào danh sách
          if (empData.userId) {
            const currentUser = await fetchUserById(empData.userId);
            // Tránh trùng lặp nếu user hiện tại đã có trong danh sách
            if (!userList.some((user) => user.id === currentUser.id)) {
              userList = [currentUser, ...userList];
            }
          }
          setUsers(userList);

          // Fetch danh sách chức vụ (giả định cần departmentId từ BE)
          if (empData.positionId && deptList.length > 0) {
            const posData = await fetchPositionsByDepartment(
              empData.departmentId || deptList[0].id
            );
            setPositions(posData || []);
          }
        } else {
          console.log("Không nhận được employee từ state:", location.state);
          toast.error("Không tìm thấy nhân viên để cập nhật");
          navigate("/employees");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, [employee, navigate, location.state]);

  // Fetch position khi departmentId thay đổi
  useEffect(() => {
    const loadPositions = async () => {
      if (formData.departmentId) {
        try {
          const posData = await fetchPositionsByDepartment(
            formData.departmentId
          );
          setPositions(posData || []);
          setFormData((prev) => ({
            ...prev,
            positionId: posData.length > 0 ? posData[0].id : "",
          }));
        } catch (error) {
          console.error("Lỗi khi tải danh sách chức vụ:", error);
          toast.error("Lỗi khi tải danh sách chức vụ");
        }
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
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth + "T00:00:00.000Z",
        gender: formData.gender,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        joiningDate: formData.joiningDate + "T00:00:00.000Z",
        employeeStatus: formData.employeeStatus,
        userId: Number(formData.userId),
        positionId: Number(formData.positionId),
      };
      console.log("Dữ liệu gửi đi trong handleSubmit:", employeeData);
      await updateEmployee(employeeData);
      toast.success("Cập nhật nhân viên thành công");
      navigate("/employees");
    } catch (error) {
      console.error("Lỗi từ server:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
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
            label="ID"
            name="id"
            value={formData.id}
            fullWidth
            disabled
          />
          <TextField
            label="Họ và tên"
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
              <MenuItem value="WORKING">Đang làm việc</MenuItem>
              <MenuItem value="RESIGNED">Đã nghỉ việc</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>User</InputLabel>
            <Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              label="User"
              disabled={users.length === 0}
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
              disabled={departments.length === 0}
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
              disabled={positions.length === 0}
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
            disabled={loading || !formData.userId || !formData.positionId}
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
