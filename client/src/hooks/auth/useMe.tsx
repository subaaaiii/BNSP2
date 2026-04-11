import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = Cookies.get("token");

      const res = await Api.get("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data;
    },
    enabled: !!Cookies.get("token"), // hanya fetch kalau ada token
    retry: false, // no retry kalau unauthorized
  });
};