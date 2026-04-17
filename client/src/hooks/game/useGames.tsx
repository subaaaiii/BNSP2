import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export const useGames = (q? : string) => {
  return useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const token = Cookies.get("token");
      const res = await Api.get("/api/admin/games", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params : q,
      });
      return res.data.data;
    },
  });
};
