import Login from "./components/Auth/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./components/pages/AdminPage";
import UserPage from "./components/pages/UserPage";
import EmployeeDashboard from "./components/pages/Admin/Employees/Dashboard";
import EmployeeCreateForm from "./components/pages/Admin/Employees/CreateForm";
import { getCurrentUser } from "./services/authService";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

const PrivateRoute = ({ children, allowedTypes }) => {
  const user = getCurrentUser();
  const isLoggedIn = !!user;
  const isAllowed = user && allowedTypes.includes(user.type);
  useEffect(() => {
    if (isLoggedIn && !isAllowed) {
      toast.error("Bạn không có quyền truy cập trang này");
    }
  }, [isLoggedIn, isAllowed]);
  if (!isLoggedIn) return <Navigate to="/" />;
  if (!isAllowed) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Không có quyền truy cập</h2>
        <p>Vui lòng liên hệ Anh Tòn nếu bạn cần quyền truy cập.</p>
      </div>
    );
  }
  return children;
};
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/employees/create"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <EmployeeCreateForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/user"
            element={
              <PrivateRoute allowedTypes={["USER"]}>
                <UserPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
