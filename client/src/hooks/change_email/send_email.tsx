import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

interface sendOTPRequest {
  email: string;
  purpose: string;
}

export const useSendChangeEmailOTP = () => {
  return useMutation({
    mutationFn: async (data: sendOTPRequest) => {
      const res = await Api.post("/send-otp", data);

      return res.data;
    },
  });
};
