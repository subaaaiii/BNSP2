import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

export const useSendChangeEmailOTP = () => {
  return useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");

      const res = await Api.post(
        "/send-otp-change-email",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    },
  });
};