import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";

export const useLoginGoogle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credential: string) => {
      return Api.post("/auth/google", {
        credential,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
