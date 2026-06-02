import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

export const useSendChangeEmailOTP = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await Api.post("/send-otp-change-email", {});

      return res.data;
    },
  });
};
