import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";

interface OrderRequest {
  order_id: string;
  status: string;
}

export const useCallBack = () => {
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      const res = await Api.post(`/api/payment/callback`, data);
      return res.data.data;
    },
  });
};
