import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const usePaymentStatus = (id?: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await Api.get(`/api/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};
