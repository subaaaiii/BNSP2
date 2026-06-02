import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import Api from "../../services/api";

interface LoginRequest {
  username: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await Api.post("/api/login", data);

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
