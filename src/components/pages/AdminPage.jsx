import { getCurrentUser, logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Avatar, Button, Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const navigate = useNavigate();
  const user = useState(getCurrentUser());

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/");
  };

  const getAvatarText = (name) => {
    return name
      ? name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
      : "U";
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Avatar
        sx={{ width: 80, height: 80, bgcolor: "primary.main", margin: "auto" }}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          getAvatarText(user?.username)
        )}
      </Avatar>
      <Typography variant="h5" sx={{ mt: 2 }}>
        {user?.username}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {user?.email}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {user?.type}
      </Typography>
      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/employees")}>
          Quản lý Nhân viên
        </Button>
        {/* <Button variant="contained" onClick={() => navigate("/users")}>
          Quản lý Người dùng
        </Button> */}
        <Button variant="contained" onClick={() => navigate("/salaries")}>
          Quản lý Lương
        </Button>
        {/* <Button variant="contained" onClick={() => navigate("/contracts")}>
          Quản lý Hợp đồng
        </Button> */}
        <Button variant="contained" onClick={() => navigate("/positions")}>
          Quản lý Chức vụ
        </Button>
        <Button variant="contained" onClick={() => navigate("/departments")}>
          Quản lý Phòng ban
        </Button>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Box>
    </Container>
  );
};
export default AdminPage;
