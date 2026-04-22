import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

export const useChatList = () => {
  return useQuery({
    queryKey: ["chatlist"],
    queryFn: async () => {
      const token = Cookies.get("token");
      const res = await Api.get("/api/chat/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });
};
