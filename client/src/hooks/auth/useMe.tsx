import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

export const useMe = () => {
  const token = Cookies.get("token");

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await Api.get("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return res.data.data;
      } catch (err: any) {
        if (err.response?.status === 401) {
          Cookies.remove("token");
        }
        throw err;
      }
    },
    enabled: !!token,
    retry: false,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: true
  });
};