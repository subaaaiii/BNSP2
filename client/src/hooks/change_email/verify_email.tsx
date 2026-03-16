import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

interface VerifyEmailRequest {
  otp: string;
  newEmail: string;
}

export const useVerifyChangeEmailOTP = () => {
  return useMutation({
    mutationFn: async ({ otp, newEmail }: VerifyEmailRequest) => {
      const token = Cookies.get("token");
      const response = await Api.post(
        "/verify-otp-change-email",
        {
          otp: otp,
          new_email: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
  });
};
