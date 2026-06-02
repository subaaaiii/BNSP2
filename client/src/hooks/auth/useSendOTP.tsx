import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

export const useSendOTP = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await Api.post("/send-otp-verify-email", { email });

      return res.data;
    },
  });
};
