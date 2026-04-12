import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id : string) => {
      const token = Cookies.get("token");

        const res = await Api.delete(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
