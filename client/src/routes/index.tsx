//import useContext
import { useContext } from "react";

//import context
import { AuthContext } from "../context/AuthContext";

//import react router dom
import { Routes, Route, Navigate } from "react-router";

//import view home
import Home from "../views/home/index.tsx";

//import view register
import Register from "../views/auth/register.tsx";

//import view login
import Login from "../views/auth/login.tsx";
import Profile from "../views/settings/profile/index.tsx";
import Settings from "../views/settings/index.tsx";
import ManageGame from "../views/admin/game/manage.tsx";
import GameList from "../views/admin/game/index.tsx";
import CreateOfferFlow from "../views/offers/createFlow.tsx";
import BecomeSeller from "../views/seller/index.tsx";
import VerifyEmail from "../views/auth/verify.tsx";
import SellerApply from "../views/seller/apply.tsx";
import ReviewSeller from "../views/admin/seller/review.tsx";
import RestrictedPage from "../views/restricted/index.tsx";
import AuthGuard from "./guard.tsx";

export default function AppRoutes() {
  const auth = useContext(AuthContext);

  const isLoading = auth?.loading ?? true;
  // Menggunakan optional chaining untuk menghindari error jika auth tidak ada
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const isVerified = auth?.user?.email_verified ?? false;
  const role = auth?.user?.role;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* route "/" */}
      <Route path="/" element={<Home />} />

      {/* route "/register" */}
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />

      {/* route "/login" */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/verify-email"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isVerified ? (
            <Navigate to="/" replace />
          ) : (
            <VerifyEmail />
          )
        }
      />

      <Route
        path="/profile"
        element={
          isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/settings"
        element={
          isAuthenticated ? <Settings /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/admin/games"
        element={
          <AuthGuard
            isAuthenticated={isAuthenticated}
            role={role}
            allowedRoles={["admin"]}
            isVerified={isVerified}
            requireVerified={true}
          >
            <GameList />
          </AuthGuard>
        }
      />
      <Route
        path="/admin/games/add"
        element={
          <AuthGuard
            isAuthenticated={isAuthenticated}
            role={role}
            allowedRoles={["admin"]}
            isVerified={isVerified}
            requireVerified={true}
          >
            <ManageGame />
          </AuthGuard>
        }
      />
      <Route
        path="/admin/games/edit/:id"
        element={
          <AuthGuard
            isAuthenticated={isAuthenticated}
            role={role}
            allowedRoles={["admin"]}
            isVerified={isVerified}
            requireVerified={true}
          >
            <ManageGame />
          </AuthGuard>
        }
      />
      <Route
        path="/offers/create"
        element={
          <AuthGuard
            isAuthenticated={isAuthenticated}
            role={role}
            allowedRoles={["seller"]}
            isVerified={isVerified}
            requireVerified={true}
          >
            <CreateOfferFlow />
          </AuthGuard>
        }
      />
      <Route
        path="/become-seller"
        element={
          <AuthGuard
            isAuthenticated={isAuthenticated}
            role={role}
            allowedRoles={["customer"]}
            isVerified={isVerified}
            requireVerified={true}
          >
            <BecomeSeller />
          </AuthGuard>
        }
      />
      <Route path="/restricted" element={<RestrictedPage />} />
      <Route
        path="/apply-seller"
        element={
          <AuthGuard
            isAuthenticated={isAuthenticated}
            role={role}
            allowedRoles={["customer"]}
            isVerified={isVerified}
            requireVerified={true}
          >
            <SellerApply />
          </AuthGuard>
        }
      />
      <Route
        path="/admin/review-sellers"
        element={
          <AuthGuard
            isAuthenticated={isAuthenticated}
            role={role}
            allowedRoles={["admin"]}
            isVerified={isVerified}
            requireVerified={true}
          >
            <ReviewSeller />
          </AuthGuard>
        }
      />
    </Routes>
  );
}
