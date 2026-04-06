import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

interface CreateProductRequest {
  gameId: string;
  title: string;
  description: string;
  price: string;
  stock: string;
  guarantee: string;
  image?: File | null;
  fieldValues: Record<string, any>;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      const token = Cookies.get("token");

      const formData = new FormData();

      formData.append("game_id", data.gameId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("guarantee", data.guarantee);
      formData.append("field_values", JSON.stringify(data.fieldValues));

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await Api.post(`/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
