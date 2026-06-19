import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

interface VerifyOTPRequest {
  otp: string;
  email: string;
  purpose: string;
}

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: async (data: VerifyOTPRequest) => {
      const response = await Api.post("/verify-otp",data);

      return response.data;
    }
  });
};
