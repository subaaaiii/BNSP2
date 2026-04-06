import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

export const useSendResetPasswordEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await Api.post("/api/forgot-password", { email });

      return res.data;
    },
  });
};
