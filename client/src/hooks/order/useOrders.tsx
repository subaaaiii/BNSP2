import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import { cleanParams } from "../../helpers/clean_params";

type filtersData = {
  status: string;
  q: string;
  type: string;
};

export const useOrders = (filters: filtersData) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const params = cleanParams(filters);
      const res = await Api.get(`/api/orders`, {
        params,
      });
      return res.data.data;
    },
  });
};
