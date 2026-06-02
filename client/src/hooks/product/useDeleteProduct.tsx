import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await Api.delete(`/api/products/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
