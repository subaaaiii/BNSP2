import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";


interface OrderRequest {
  order_id : string,
  status : string,
}

export const useCallBack = () => {
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      const token = Cookies.get("token");
        const res = await Api.post(`/api/payment/callback`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.data;
    },
  });
};
