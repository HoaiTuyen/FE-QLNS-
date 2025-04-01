import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AdminPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/");
  };
  return (
    <div>
      <h1>Admin</h1>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};
export default AdminPage;
