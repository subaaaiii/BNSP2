import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

interface PasswordVerifyRequest {
  password: string;
}

export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: async (data: PasswordVerifyRequest) => {
      const res = await Api.post("/verify-password", data);

      return res.data;
    },
  });
};
