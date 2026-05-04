import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";


interface OrderRequest {
  order_id : string,
  status : string,
}

export const useOrderStatus = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      const token = Cookies.get("token");
        const res = await Api.post(`/api/orders/status`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.data;
    },
    onSuccess(_, variables) {
        queryClient.invalidateQueries({ queryKey: ["order", variables.order_id] })
    },
  });
};
