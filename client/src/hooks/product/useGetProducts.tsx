import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useGetProducts = (filters: {
  status?: string;
  game_id?: string;
  q?: string;
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: [
      "products",
      filters.status,
      filters.game_id,
      filters.q,
      filters.page,
      filters.limit,
    ],
    queryFn: async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== undefined && value !== null,
        ),
      );
      const res = await Api.get("/api/products", {
        params: cleanParams,
      });
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};
