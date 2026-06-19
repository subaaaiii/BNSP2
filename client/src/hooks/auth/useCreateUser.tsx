import { useMutation } from "@tanstack/react-query";

import Api from "../../services/api";

interface CreateUserRequest {
  email: string;
  otp: string;
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await Api.post("/api/users", data);

      return response.data;
    },
  });
};
