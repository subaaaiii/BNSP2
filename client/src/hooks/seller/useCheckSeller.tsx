import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export const useCheckSeller = () => {
  return useQuery({
    queryKey: ["seller"],
    queryFn: async () => {
    const token = Cookies.get("token");
      const res = await Api.get(`/api/seller`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      return res.data.data;
    },
    retry: false,
  });
};