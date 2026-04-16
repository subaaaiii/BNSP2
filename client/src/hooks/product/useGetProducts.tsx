import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export const useGetProducts = (filters:{
    status? : string;
    game_id? : string;
    q? :string;
}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const token = Cookies.get("token");
      const res = await Api.get("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      return res.data.data;
    },
  });
};
