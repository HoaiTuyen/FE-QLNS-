import * as React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import { logout } from "../../../../services/authService";

function Header({ toggleDrawer }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#1976d2" }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawer}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Hệ thống quản lý
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
