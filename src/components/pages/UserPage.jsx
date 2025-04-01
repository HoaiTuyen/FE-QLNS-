import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const UserPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/");
  };
  return (
    <div>
      UserPage nè !
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};
export default UserPage;
