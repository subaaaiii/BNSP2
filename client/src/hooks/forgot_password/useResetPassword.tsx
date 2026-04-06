import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (resetData: { token: string; password: string }) => {
      const res = await Api.post("/api/reset-password", resetData);
      return res.data;
    },
  });
};
