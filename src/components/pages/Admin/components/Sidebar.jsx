import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";

const drawerWidth = 240;

function Sidebar({ open }) {
  const navigate = useNavigate();
  const menuItems = [
    { text: "Quản lý nhân viên", icon: <PeopleIcon />, navigate: "/employees" },
    { text: "Quản lý lương", icon: <AttachMoneyIcon />, navigate: "/salary" },
    {
      text: "Quản lý phòng ban",
      icon: <BusinessIcon />,
      navigate: "/departments",
    },
    { text: "Quản lý chức vụ", icon: <WorkIcon />, navigate: "/positions" },
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          top: 64,
          height: "calc(100% - 64px)",
          zIndex: 1200,
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.navigate)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
