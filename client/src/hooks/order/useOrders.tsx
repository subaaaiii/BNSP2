import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import { cleanParams } from "../../helpers/clean_params";
import Cookies from "js-cookie";

type filtersData = {
  status: string;
  q: string,
  type: string,
};

export const useOrders = (filters: filtersData) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const params = cleanParams(filters);
      const token = Cookies.get("token");
      const res = await Api.get(`/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      return res.data.data;
    },
  });
};
