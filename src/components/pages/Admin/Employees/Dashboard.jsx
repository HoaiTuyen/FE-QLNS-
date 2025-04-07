import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import {
  fetchEmployees,
  deleteEmployee,
} from "../../../../services/adminService";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees(page, pageSize);
      setEmployees(data.employees);
      setTotalPages(data.totalPages); // Cập nhật tổng số trang
    } catch (error) {
      console.error("Lỗi khi load danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadEmployees();
  }, [page, loadEmployees]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await deleteEmployee(id);
        toast.success("Xóa nhân viên thành công!");
        loadEmployees();
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        toast.error("Lỗi khi xóa nhân viên!");
      } finally {
        setLoading(false);
      }
    }
  };

  // 👉 Hàm xử lý ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handlePreviousPage = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  const handleSearch = () => {
    setPage(0);
    loadEmployees();
  };

  const handleEdit = (employee) => {
    navigate("/employees/update", { state: { employee } }); // Truyền dữ liệu qua state
    console.log("Employee nhận được:", employee);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header và Sidebar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1200 }}>
        <Header toggleDrawer={toggleDrawer} />
      </Box>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            transition: "margin-left 0.3s",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Quản lý nhân viên
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/employees/create")}
            >
              Thêm Nhân Viên
            </Button>
            <TextField
              label="Tìm kiếm nhân viên"
              variant="outlined"
              sx={{ width: "50%" }}
              value={searchQuery}
              onChange={(e) =>
                handleSearch() + setSearchQuery(e.target.value.toLowerCase())
              }
            />
          </Box>
          {loading ? (
            <Typography align="center">Đang tải dữ liệu...</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Họ và Tên</TableCell>
                    <TableCell>Ngày sinh</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>Ngày vào làm</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees
                    .filter((emp) =>
                      emp.fullName.toLowerCase().includes(searchQuery)
                    )
                    .map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell>{emp.id}</TableCell>
                        <TableCell>{emp.fullName}</TableCell>
                        <TableCell>{formatDate(emp.dateOfBirth)}</TableCell>
                        <TableCell>
                          {emp.gender === "MALE" ? "Nam" : "Nữ"}
                        </TableCell>
                        <TableCell>{emp.phone}</TableCell>
                        <TableCell>{emp.address}</TableCell>
                        <TableCell>{formatDate(emp.joiningDate)}</TableCell>
                        <TableCell>{emp.employeeStatus}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(emp)}
                            sx={{ mr: 1 }}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(emp.id)}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box
            sx={{
              mt: "auto", // Đẩy xuống dưới cùng
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => setPage(0)}
              sx={{ minWidth: "120px" }}
            >
              Trang đầu
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={page === 0}
              >
                Trang trước
              </Button>
              <Typography>Trang {page + 1}</Typography>
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
              >
                Trang sau
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EmployeeDashboard;
