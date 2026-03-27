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
import CreateProduct from "../views/product/create.tsx";
import GameBrand from "../views/product/game.tsx";

export default function AppRoutes() {
  // Menggunakan useContext untuk mendapatkan nilai dari AuthContext
  const auth = useContext(AuthContext);

  // Menggunakan optional chaining untuk menghindari error jika auth tidak ada
  const isAuthenticated = auth?.isAuthenticated ?? false;

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
          isAuthenticated ? <GameList /> : <Navigate to="/login" replace />
        }
      />
        <Route
          path="/admin/games/add"
          element={
            isAuthenticated ? <ManageGame /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/games/edit/:id"
          element={
            isAuthenticated ? <ManageGame /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/product/games"
          element={
            isAuthenticated ? <GameBrand /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/product/create/:id"
          element={
            isAuthenticated ? <CreateProduct /> : <Navigate to="/login" replace />
          }
        />
    </Routes>
  );
}
