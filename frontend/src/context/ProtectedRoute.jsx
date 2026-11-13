/* eslint-disable react-hooks/purity */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Issued At:", new Date(payload.iat * 1000));
      console.log("Expires At:", new Date(payload.exp * 1000));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const invalid =
    !token ||
    isTokenExpired(token) ||
    (role && userRole !== role);

  if (invalid) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;