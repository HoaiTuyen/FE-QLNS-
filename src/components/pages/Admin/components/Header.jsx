import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import { logout } from "../../../../services/authService";

function Header({ toggleDrawer }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/");
    handleClose();
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
        <Tooltip title="Tài khoản">
          <IconButton onClick={handleMenu} sx={{ p: 0 }}>
            <Avatar alt="User" src="/path-to-avatar.jpg" />{" "}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
