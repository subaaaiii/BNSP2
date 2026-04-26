import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useGetProductById = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await Api.get(`/api/products/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};
