import { getCurrentUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import Sidebar from "./Admin/components/Sidebar";
import Header from "./Admin/components/Header";

const AdminPage = () => {
  const navigate = useNavigate();
  const user = useState(getCurrentUser());
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Header toggleDrawer={toggleDrawer} />
      <Container
        maxWidth="md"
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
        ></Box>
      </Container>
    </Box>
  );
};
export default AdminPage;
