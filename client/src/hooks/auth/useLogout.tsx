import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import Api from "../../services/api";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const response = await Api.post("/api/logout");

      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);

      queryClient.removeQueries({ queryKey: ["me"] });

      toast.success("Logout berhasil");
      navigate("/login");
    },
  });
};
