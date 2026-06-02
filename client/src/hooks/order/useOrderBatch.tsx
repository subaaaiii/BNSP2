import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useOrderBatch = (orderIds: string[]) => {
  return useQuery({
    queryKey: ["orders", [...orderIds].sort()], 
    queryFn: async () => {
      const res = await Api.get(`/api/orders/batch`, {
        params: { ids: orderIds.join(",") },
      });
      return res.data.data;
    },
    enabled: orderIds.length > 0, 
  });
};