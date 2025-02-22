import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("role"); // Get role from localStorage

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />; // Redirect if role is not allowed
  }

  return children;
};

export default ProtectedRoute;