import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id?: string) => {
      await Api.delete(`/api/admin/games/${id}`);
      return;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.removeQueries({ queryKey: ["game", id] });
    },
  });
};
