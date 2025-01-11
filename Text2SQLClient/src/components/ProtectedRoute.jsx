import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isVip = false }) => {
  const isLoggedIn = !!localStorage.getItem("user");
  const userIsVip = localStorage.getItem("isVip") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isVip && !userIsVip) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;