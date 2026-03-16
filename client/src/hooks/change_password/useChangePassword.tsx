import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

interface PasswordChangeRequest {
    password: string;
    newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ( data: PasswordChangeRequest) => {
      const token = Cookies.get("token");

      const res = await Api.post(
        "/change-password",
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