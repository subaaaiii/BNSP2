import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

interface OrderRequest {
  product_id: number;
  qty: number;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      const res = await Api.post(`/api/orders`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.product_id],
      });
    },
  });
};
