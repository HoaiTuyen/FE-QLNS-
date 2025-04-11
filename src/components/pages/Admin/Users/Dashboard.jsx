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
  deleteUser,
  fetchUsersListByPage,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const toggleDrawer = () => setOpen(!open);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsersListByPage(page, pageSize);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng", error);
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [page, loadUsers]);

  const handleEdit = (user) => {
    navigate("/users/update", { state: { user } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await deleteUser(id);
        loadUsers(); // Tải lại danh sách sau khi xóa
        toast.success("Xóa người dùng thành công");
      } catch (error) {
        toast.error(
          "Lỗi khi xóa người dùng: " + (error.message || "Lỗi không xác định")
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
    loadUsers();
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
          Quản Lý Người Dùng
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/users/create")}
          >
            Thêm Người Dùng
          </Button>
          <TextField
            label="Tìm kiếm người dùng"
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
                  <TableCell> Tên người dùng</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Loại tài khoản</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .filter((us) =>
                    us.username.toLowerCase().includes(searchQuery)
                  )
                  .map((us) => (
                    <TableRow key={us.id}>
                      <TableCell>{us.id}</TableCell>
                      <TableCell>{us.username}</TableCell>
                      <TableCell>{us.email}</TableCell>
                      <TableCell>{us.type}</TableCell>
                      <TableCell>{us.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(us)}
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(us.id)}
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

export default Users;
