import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import { cleanParams } from "../../helpers/clean_params";

export const useGames = (filters: {
  q?: string;
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["games", filters],
    queryFn: async () => {
      const params = cleanParams(filters);
      const res = await Api.get("/api/admin/games", {
        params,
      });
      return res.data.data;
    },
  });
};
