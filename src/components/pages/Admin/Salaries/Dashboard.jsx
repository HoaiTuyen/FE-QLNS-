import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  deleteSalary,
  fetchSalariesListByPage,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const toggleDrawer = () => setOpen(!open);

  const loadSalaries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSalariesListByPage(page, pageSize);
      setSalaries(data.salaries);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bảng lương:", error);
      toast.error("Lỗi khi tải danh sách bảng lương");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadSalaries();
  }, [page, loadSalaries]);

  const handleEdit = (salary) => {
    navigate("/salaries/edit", { state: { salary } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bảng lương này?")) {
      try {
        await deleteSalary(id);
        loadSalaries(); // Tải lại danh sách sau khi xóa
        toast.success("Xóa bảng lương thành công");
      } catch (error) {
        toast.error(
          "Lỗi khi xóa bảng lương: " + (error.message || "Lỗi không xác định")
        );
      }
    }
  };

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
    loadSalaries();
  };

  //console.log("Salaries:", salaries); // Log để kiểm tra dữ liệu;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Container
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
          Quản Lý Bảng Lương
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/salaries/create")}
          >
            Thêm Bảng Lương
          </Button>
          <TextField
            label="Tìm kiếm bảng lương"
            value={searchQuery}
            variant="outlined"
            size="small"
            sx={{ width: "50%" }}
            onChange={(e) => {
              handleSearch() + setSearchQuery(e.target.value.toLowerCase());
            }}
          />
        </Box>
        {loading ? (
          <Typography align="center">Đang tải dữ liệu...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Lương cơ bản</TableCell>
                  <TableCell>Tỉ lệ phụ cấp</TableCell>
                  <TableCell>Tổng lương</TableCell>
                  <TableCell>Ngày có hiệu lực</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaries
                  .filter((sal) => sal.name.toLowerCase().includes(searchQuery))
                  .map((sal) => (
                    <TableRow key={sal.id}>
                      <TableCell>{sal.id}</TableCell>
                      <TableCell>{sal.name}</TableCell>
                      <TableCell>{sal.basicSalary}</TableCell>
                      <TableCell>{sal.allowance}</TableCell>
                      <TableCell>
                        {sal.basicSalary + sal.basicSalary * sal.allowance}
                      </TableCell>
                      <TableCell>{formatDate(sal.effectiveDate)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(sal)}
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(sal.id)}
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
            disabled={page === 0}
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
      </Container>
    </Box>
  );
}

export default Salaries;
