import Login from "./components/Auth/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./components/pages/AdminPage";
import UserPage from "./components/pages/UserPage";
import { getCurrentUser } from "./services/authService";
import { ToastContainer } from "react-toastify";
const PrivateRoute = ({ children, allowedTypes }) => {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/" />;
  if (!allowedTypes.includes(user.type)) return <Navigate to="/" />;

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
