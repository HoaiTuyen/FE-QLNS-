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
  deleteContract,
  fetchContractsListByPage,
} from "../../../../services/adminService";
import { toast } from "react-toastify";

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const toggleDrawer = () => setOpen(!open);

  const loadContracts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchContractsListByPage(page, pageSize);
      setContracts(data.contracts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hợp đồng:", error);
      toast.error("Lỗi khi tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadContracts();
  }, [page, loadContracts]);

  const handleEdit = (contract) => {
    navigate("/contracts/update", { state: { contract } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa hợp đồng này?")) {
      try {
        await deleteContract(id);
        loadContracts(); // Tải lại danh sách sau khi xóa
        toast.success("Xóa hợp đồng thành công");
      } catch (error) {
        toast.error(
          "Lỗi khi xóa hợp đồng: " + (error.message || "Lỗi không xác định")
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
    loadContracts();
  };

  //console.log("Contracts:", contracts); // Log để kiểm tra dữ liệu;

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
          Quản Lý Hợp Đồng
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/contracts/create")}
          >
            Thêm Hợp Đồng
          </Button>
          <TextField
            label="Tìm kiếm hợp đồng"
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
                  <TableCell>Loại hợp đồng</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts
                  .filter((cont) =>
                    cont.contractType.toLowerCase().includes(searchQuery)
                  )
                  .map((cont) => (
                    <TableRow key={cont.id}>
                      <TableCell>{cont.id}</TableCell>
                      <TableCell>{cont.contractType}</TableCell>
                      <TableCell>{formatDate(cont.startDate)}</TableCell>
                      <TableCell>{formatDate(cont.endDate)}</TableCell>
                      <TableCell>
                        {cont.notes ? cont.notes : "Không có ghi chú"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(cont)}
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(cont.id)}
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

export default Contracts;
