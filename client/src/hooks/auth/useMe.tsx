import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await Api.get("/api/me");
      return res.data.data;
    },
    retry: false,
  });
};
