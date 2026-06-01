import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
// import Cookies from "js-cookie";

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
      // Cookies.set("token", data.data.token);
      queryClient.setQueryData(["me"], data.data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
