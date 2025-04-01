import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
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
} from "../../../services/employeeService";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

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
    return new Date(dateString).toLocaleDateString("vi-VN"); // Format ngày theo tiếng Việt
  };

  const handlePreviousPage = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  const handleSearch = () => {
    setPage(0); // Reset về trang đầu khi tìm kiếm
    loadEmployees();
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>
      <Button variant="contained" onClick={() => navigate("/employees/create")}>
        Thêm Nhân Viên
      </Button>
      <TextField
        label="Tìm kiếm nhân viên"
        variant="outlined"
        fullWidth
        onChange={(e) =>
          handleSearch() + setSearchQuery(e.target.value.toLowerCase())
        }
      />
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
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
      <Button variant="contained" onClick={() => setPage(0)}>
        Trang đầu
      </Button>
      <Button
        variant="contained"
        onClick={handlePreviousPage}
        disabled={page === 0}
      >
        Trang trước
      </Button>
      <span>Trang {page + 1}</span>
      <Button
        variant="contained"
        onClick={handleNextPage}
        disabled={page >= totalPages - 1}
      >
        Trang sau
      </Button>
    </div>
  );
};

export default EmployeeDashboard;
