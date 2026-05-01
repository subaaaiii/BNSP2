import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export const usePaymentStatus = (id? : string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
    const token = Cookies.get("token");
      const res = await Api.get(`/api/orders/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return res.data.data;
    },
    enabled: !!id,
  });
};
