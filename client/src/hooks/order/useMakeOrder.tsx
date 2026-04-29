import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";


interface OrderRequest {
  product_id : number,
  qty : number,
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      const token = Cookies.get("token");
        const res = await Api.post(`/api/orders`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["product", variables.product_id] })
    },
  });
};
