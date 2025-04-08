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
  deleteDepartment,
  fetchDepartmentsListByPage,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const toggleDrawer = () => setOpen(!open);

  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDepartmentsListByPage(page, pageSize);
      setDepartments(data.departments);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng ban:", error);
      toast.error("Lỗi khi tải danh sách phòng ban");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadDepartments();
  }, [page, loadDepartments]);

  const handleEdit = (department) => {
    navigate("/departments/edit", { state: { department } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phòng ban này?")) {
      try {
        await deleteDepartment(id);
        loadDepartments(); // Tải lại danh sách sau khi xóa
        toast.success("Xóa phòng ban thành công");
      } catch (error) {
        toast.error(
          "Lỗi khi xóa phòng ban: " + (error.message || "Lỗi không xác định")
        );
      }
    }
  };

  const handlePreviousPage = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  const handleSearch = () => {
    setPage(0);
    loadDepartments();
  };

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
          Quản Lý Phòng Ban
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/departments/create")}
          >
            Thêm Phòng Ban
          </Button>
          <TextField
            label="Tìm kiếm phòng ban"
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
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments
                  .filter((dept) =>
                    dept.name.toLowerCase().includes(searchQuery)
                  )
                  .map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>{dept.id}</TableCell>
                      <TableCell>{dept.name}</TableCell>
                      <TableCell>{dept.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(dept)}
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(dept.id)}
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

export default Departments;
