import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

interface VerifyEmailRequest {
  otp: string;
  newEmail: string;
}

export const useVerifyChangeEmailOTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ otp, newEmail }: VerifyEmailRequest) => {
      const response = await Api.post("/verify-otp-change-email", {
        otp: otp,
        new_email: newEmail,
      });

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.data);
    },
  });
};
