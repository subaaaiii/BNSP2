import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";
import { cleanParams } from "../../helpers/clean_params";

export const useChatList = (filters :{q?:string}) => {
  return useQuery({
    queryKey: ["chatlist", filters],
    queryFn: async () => {
      const token = Cookies.get("token");
      const params = cleanParams(filters)
      const res = await Api.get("/api/chat/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params
      });
      return res.data;
    },
  });
};
