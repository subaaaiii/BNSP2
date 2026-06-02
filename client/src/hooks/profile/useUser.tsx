import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useUser = (id?: number) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await Api.get(`/api/users/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};
