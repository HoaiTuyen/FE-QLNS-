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
import MoneyIcon from "@mui/icons-material/Money";
import AccountIcon from "@mui/icons-material/AccountCircle";
import ContractIcon from "@mui/icons-material/AssignmentInd";
const drawerWidth = 240;

function Sidebar({ open }) {
  const navigate = useNavigate();
  const menuItems = [
    { text: "Quản lý nhân viên", icon: <PeopleIcon />, navigate: "/employees" },
    {
      text: "Quản lý phòng ban",
      icon: <BusinessIcon />,
      navigate: "/departments",
    },
    { text: "Quản lý chức vụ", icon: <WorkIcon />, navigate: "/positions" },
    { text: "Quản lý lương", icon: <MoneyIcon />, navigate: "/salaries" },
    {
      text: "Quản lý tài khoản",
      icon: <AccountIcon />,
      navigate: "/accounts",
    },
    {
      text: "Quản lý hợp đồng",
      icon: <ContractIcon />,
      navigate: "/contracts",
    },
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
