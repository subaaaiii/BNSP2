import { useContext, lazy, Suspense } from "react";
import { AuthContext } from "../context/AuthContext";
import { Routes, Route, Navigate, useLocation } from "react-router";
import AuthGuard from "./guard.tsx";
import PageLoader from "../components/PageLoader";
import VerifyUser from "../views/auth/verify_user.tsx";
const Home = lazy(() => import("../views/home/index.tsx"));
const Register = lazy(() => import("../views/auth/register.tsx"));
const Login = lazy(() => import("../views/auth/login.tsx"));
const Profile = lazy(() => import("../views/settings/profile/index.tsx"));
const Settings = lazy(() => import("../views/settings/index.tsx"));
const ManageGame = lazy(() => import("../views/admin/game/manage.tsx"));
const GameList = lazy(() => import("../views/admin/game/index.tsx"));
const CreateOfferFlow = lazy(() => import("../views/offers/createFlow.tsx"));
const BecomeSeller = lazy(() => import("../views/seller/index.tsx"));
const VerifyEmail = lazy(() => import("../views/auth/verify.tsx"));
const SellerApply = lazy(() => import("../views/seller/apply.tsx"));
const ReviewSeller = lazy(() => import("../views/admin/seller/review.tsx"));
const RestrictedPage = lazy(() => import("../views/restricted/index.tsx"));
const ForgotPassword = lazy(() => import("../views/forgot-password/index.tsx"));
const ResetPassword = lazy(() => import("../views/forgot-password/reset.tsx"));
const ManageOffers = lazy(() => import("../views/offers/index.tsx"));
const UserProfile = lazy(() => import("../views/user/profile.tsx"));
const BrandProducts = lazy(() => import("../views/product/brand_product.tsx"));
const DetailProduct = lazy(() => import("../views/product/detail.tsx"));
const Chat = lazy(() => import("../views/chat/index.tsx"));
const Brand = lazy(() => import("../views/product/brand.tsx"));
const Orders = lazy(() => import("../views/orders/order.tsx"));
const OrderDetail = lazy(() => import("../views/orders/detail.tsx"));

const LoginWrapper = () => {
  const location = useLocation();
  const auth = useContext(AuthContext);

  const isAuthenticated = auth?.isAuthenticated ?? false;
  const from = location.state?.from || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Login />;
};

export default function AppRoutes() {
  const auth = useContext(AuthContext);

  const isLoading = auth?.loading ?? true;
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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* route "/" */}
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<BrandProducts />} />
        <Route path="/brands" element={<Brand />} />
        <Route path="/orders/:type" element={<Orders />} />
        <Route path="/orders/detail/:id" element={<OrderDetail />} />
        <Route path="/products/detail/:id" element={<DetailProduct />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/offer/:id" element={<Chat />} />
        <Route path="/chat/order/:id" element={<Chat />} />

        {/* route "/register" */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />

        {/* route "/login" */}
        <Route path="/login" element={<LoginWrapper />} />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />
          }
        />
        <Route
          path="/reset-password"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />
          }
        />

        <Route
          path="/verify-email"
          element={
             isVerified ? (
              <Navigate to="/" replace />
            ) : (
              <VerifyEmail />
            )
          }
        />
        <Route
          path="/verify-user"
          element={
             isVerified ? (
              <Navigate to="/" replace />
            ) : (
              <VerifyUser />
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
          path="/user/profile"
          element={
            isAuthenticated ? <UserProfile /> : <Navigate to="/login" replace />
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
          path="/offers"
          element={
            <AuthGuard
              isAuthenticated={isAuthenticated}
              role={role}
              allowedRoles={["seller"]}
              isVerified={isVerified}
              requireVerified={true}
            >
              <ManageOffers />
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
    </Suspense>
  );
}
