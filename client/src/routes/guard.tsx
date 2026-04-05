import { Navigate } from "react-router";

interface AuthGuardProps {
  isAuthenticated: boolean;
  role?: string;
  allowedRoles?: string[];
  isVerified?: boolean;
  requireVerified?: boolean;
  children: React.ReactNode;
}

const AuthGuard = ({
  isAuthenticated,
  role,
  allowedRoles,
  isVerified,
  requireVerified,
  children,
}: AuthGuardProps) => {
  // belum login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // role tidak sesuai
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/restricted" replace />;
  }

  // belum verifikasi
  if (requireVerified && !isVerified) {
    return <Navigate to="/verify-email" replace state={{ message: "Please verify your email first." }} />;
  }

  return <>{children}</>;
};

export default AuthGuard;