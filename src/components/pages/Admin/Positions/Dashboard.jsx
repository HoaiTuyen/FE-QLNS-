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
  deletePosition,
  fetchPositionsListByPage,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function Departments() {
  const [positions, setPositions] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const toggleDrawer = () => setOpen(!open);

  const loadPositions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPositionsListByPage(page, pageSize);
      setPositions(data.positions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng ban:", error);
      toast.error("Lỗi khi tải danh sách phòng ban");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadPositions();
  }, [page, loadPositions]);

  const handleEdit = (position) => {
    navigate("/position/edit", { state: { position } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chức vụ này?")) {
      try {
        await deletePosition(id);
        loadPositions(); // Tải lại danh sách sau khi xóa
        toast.success("Xóa chức vụ thành công");
      } catch (error) {
        toast.error(
          "Lỗi khi xóa chức vụ : " + (error.message || "Lỗi không xác định")
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
    loadPositions();
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
          Quản Lý Chức Vụ
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/positions/create")}
          >
            Thêm Chức Vụ
          </Button>
          <TextField
            label="Tìm kiếm chức vụ"
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
                {positions
                  .filter((pos) => pos.name.toLowerCase().includes(searchQuery))
                  .map((pos) => (
                    <TableRow key={pos.id}>
                      <TableCell>{pos.id}</TableCell>
                      <TableCell>{pos.name}</TableCell>
                      <TableCell>{pos.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(pos)}
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(pos.id)}
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
      </Container>
    </Box>
  );
}

export default Departments;
