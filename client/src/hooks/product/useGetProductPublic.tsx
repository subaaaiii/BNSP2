import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useGetProductsPublic = (filters: {
  game_id?: string;
  q?: string;
  page: number;
  limit: number;
  sort: string;
}) => {
  return useQuery({
    queryKey: [
      "products",
      filters.game_id,
      filters.q,
      filters.page,
      filters.limit,
      filters.sort,
    ],
    queryFn: async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== undefined && value !== null,
        ),
      );
      const res = await Api.get("/api/products/public", {
        params: cleanParams,
      });
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};
