import Login from "./components/Auth/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./components/pages/AdminPage";
import UserPage from "./components/pages/UserPage";
import EmployeeDashboard from "./components/pages/Admin/Employees/Dashboard";
import EmployeeCreateForm from "./components/pages/Admin/Employees/CreateForm";
import EmployeeUpdateForm from "./components/pages/Admin/Employees/UpdateForm";
import DepartmentDashboard from "./components/pages/Admin/Departments/Dashboard";
import DepartmentCreateForm from "./components/pages/Admin/Departments/CreateForm";
import DepartmentUpdateForm from "./components/pages/Admin/Departments/UpdateForm";
import PositionDashboard from "./components/pages/Admin/Positions/Dashboard";
import PositionCreateForm from "./components/pages/Admin/Positions/CreateForm";
//import PositionUpdateForm from "./components/pages/Admin/Positions/UpdateForm";
import SalaryDashboard from "./components/pages/Admin/Salaries/Dashboard";
import SalaryCreateForm from "./components/pages/Admin/Salaries/CreateForm";
//import SalaryUpdateForm from "./components/pages/Admin/Salaries/UpdateForm";
import UserDashboard from "./components/pages/Admin/Users/Dashboard";
import UserCreateForm from "./components/pages/Admin/Users/CreateForm";
//import UserUpdateForm from "./components/pages/Admin/Users/UpdateForm";
import ContractDashboard from "./components/pages/Admin/Contracts/Dashboard";
import ContractCreateForm from "./components/pages/Admin/Contracts/CreateForm";
import { getCurrentUser } from "./services/authService";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

const PrivateRoute = ({ children, allowedTypes }) => {
  const user = getCurrentUser();
  let isLoggedIn = !!user;

  const isAllowed = user && allowedTypes.includes(user.type);

  useEffect(() => {
    if (isLoggedIn && !isAllowed) {
      toast.error("Bạn không có quyền truy cập trang này");
    }
  }, [isLoggedIn, isAllowed]);

  if (!isLoggedIn) return <Navigate to="/" />;
  // else if (user.type === "ADMIN") return <Navigate to="/admin" />;
  // else if (user.type === "USER") return <Navigate to="/user" />;
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
const HomePage = () => {
  const user = getCurrentUser();
  if (!user) {
    return <Login />;
  } else if (user.type === "ADMIN") {
    return <Navigate to="/admin" />;
  } else if (user.type === "USER") {
    return <Navigate to="/user" />;
  } else {
    return <Login />;
  }
};
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

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
            path="/employees/update"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <EmployeeUpdateForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/departments"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <DepartmentDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/departments/create"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <DepartmentCreateForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/departments/update"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <DepartmentUpdateForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/positions"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <PositionDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/positions/create"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <PositionCreateForm />
              </PrivateRoute>
            }
          />

          {/* <Route
            path="/positions/update"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <PositionUpdateForm />
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/salaries"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <SalaryDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/salaries/create"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <SalaryCreateForm />
              </PrivateRoute>
            }
          />

          {/* <Route
            path="/salaries/update"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <SalaryUpdateForm />
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/users"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/users/create"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <UserCreateForm />
              </PrivateRoute>
            }
          />

          {/* <Route
            path="/users/update"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <UserUpdateForm />
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/contracts"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <ContractDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/contracts/create"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <ContractCreateForm />
              </PrivateRoute>
            }
          />

          {/* <Route
            path="/users/update"
            element={
              <PrivateRoute allowedTypes={["ADMIN"]}>
                <UserUpdateForm />
              </PrivateRoute>
            }
          /> */}

          {/* UserPage */}

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
