import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
}
