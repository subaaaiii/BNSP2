import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export const useUser = (id?: number) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
    const token = Cookies.get("token");
      const res = await Api.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      return res.data.data;
    },
    enabled: !!id,
  });
};