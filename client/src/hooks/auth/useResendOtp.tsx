import { useMutation } from "@tanstack/react-query";

import Api from "../../services/api";

interface ResendOTPRequest {
  email: string;
}

export const useResendOTP = () => {
  return useMutation({
    mutationFn: async (data: ResendOTPRequest) => {
      const response = await Api.post("/api/register/resend-otp", data);

      return response.data;
    },
  });
};
