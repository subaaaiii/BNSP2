import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

interface ChangeEmailRequest {
  new_email: string;
  verification_token: string;
}

export const useChangeEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChangeEmailRequest) => {
      const response = await Api.post("/change-email", data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
};
