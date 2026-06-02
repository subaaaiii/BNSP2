import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

interface PasswordChangeRequest {
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: PasswordChangeRequest) => {
      const res = await Api.post("/change-password", data);

      return res.data;
    },
  });
};
