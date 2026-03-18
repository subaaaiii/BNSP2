import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

interface PasswordVerifyRequest {
    password: string;
}

export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: async ( data: PasswordVerifyRequest) => {
      const token = Cookies.get("token");

      const res = await Api.post(
        "/verify-password",
        data,
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