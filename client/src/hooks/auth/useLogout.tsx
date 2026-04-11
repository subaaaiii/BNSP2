import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// custom hook useLogout
export const useLogout = (): (() => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fungsi logout
  const logout = (): void => {
    Cookies.remove("token");

    queryClient.setQueryData(["me"], null);

    queryClient.removeQueries({ queryKey: ["me"] });

    toast.success("Logout berhasil");
    navigate("/login");
  };

  return logout;
};
