import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useProductBatch = (productIds: number[]) => {
  return useQuery({
    queryKey: ["products", productIds.sort()], 
    queryFn: async () => {
      const res = await Api.get(`/api/products/batch`, {
        params: { ids: productIds.join(",") },
      });
      return res.data.data;
    },
    enabled: productIds.length > 0, 
  });
};