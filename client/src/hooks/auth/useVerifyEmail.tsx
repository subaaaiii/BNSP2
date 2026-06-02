import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

interface VerifyEmailRequest {
  otp: string;
  email: string;
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async ({ otp, email }: VerifyEmailRequest) => {
      const response = await Api.post("/verify-email", {
        otp,
        email,
      });

      return response.data;
    },
  });
};
