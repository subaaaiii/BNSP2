import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useCheckSeller = () => {
  return useQuery({
    queryKey: ["seller"],
    queryFn: async () => {
      const res = await Api.get(`/api/seller`);
      return res.data.data;
    },
    retry: false,
  });
};
