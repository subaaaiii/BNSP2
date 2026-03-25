import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id?: string) => {
      const token = Cookies.get("token");
      await Api.delete(`/api/admin/games/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.removeQueries({ queryKey: ["game", id] });
    },
  });
};
