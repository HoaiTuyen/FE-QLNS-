import { getCurrentUser } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import {
  fetchCountUser,
  fetchCountSalary,
  fetchCountPosition,
  fetchCountEmployee,
  fetchCountDepartment,
  fetchCountContract,
  fetchPositionDetail,
} from "../../../services/reportService";
import StatsCard from "./StatsCard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminPage = () => {
  const navigate = useNavigate();
  const user = useState(getCurrentUser());
  const [open, setOpen] = useState(true);
  const [stats, setStats] = useState({});
  const [positionData, setPositionData] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          users,
          salaries,
          positions,
          employees,
          departments,
          contracts,
          positionDetail,
        ] = await Promise.all([
          fetchCountUser(),
          fetchCountSalary(),
          fetchCountPosition(),
          fetchCountEmployee(),
          fetchCountDepartment(),
          fetchCountContract(),
          fetchPositionDetail(),
        ]);

        setStats({
          users,
          salaries,
          positions,
          employees,
          departments,
          contracts,
        });

        setPositionData(positionDetail);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      }
    };

    loadStats();
  }, []);

  const chartData = {
    labels: positionData.map((p) => p.positionName),
    datasets: [
      {
        label: "Số lượng nhân sự",
        data: positionData.map((p) => p.employeeCount),
        backgroundColor: "#3f51b5",
      },
    ],
  };

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Header toggleDrawer={toggleDrawer} />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: open ? "240px" : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Thống Kê Tổng Quan
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Người dùng" value={stats.users} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Nhân viên" value={stats.employees} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Chức vụ" value={stats.positions} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Phòng ban" value={stats.departments} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Hợp đồng" value={stats.contracts} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Bảng lương" value={stats.salaries} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Phân bố nhân sự theo chức vụ
          </Typography>
          <Bar data={chartData} />
        </Box>
      </Container>
    </Box>
  );
};
export default AdminPage;
