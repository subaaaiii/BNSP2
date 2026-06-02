import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import { cleanParams } from "../../helpers/clean_params";

export const useChatList = (filters: { q?: string }) => {
  return useQuery({
    queryKey: ["chatlist", filters],
    queryFn: async () => {
      const params = cleanParams(filters);
      const res = await Api.get("/api/chat/list", {
        params: params,
      });
      return res.data;
    },
  });
};
