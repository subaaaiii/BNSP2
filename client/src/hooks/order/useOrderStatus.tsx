import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

interface OrderRequest {
  order_id: string;
  status: string;
}

export const useOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      const res = await Api.post(`/api/orders/status`, data);
      return res.data.data;
    },
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: ["order", variables.order_id],
      });
    },
  });
};
