import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

interface CreateProductRequest {
  gameId: string;
  title: string;
  description: string;
  price: string;
  stock: string;
  guarantee: string;
  image?: File | null;
  remove_image?: boolean;
  fieldValues: Record<string, any>;
}

export const useCreateAndUpdateProduct = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("guarantee", data.guarantee);
      formData.append("field_values", JSON.stringify(data.fieldValues));

      if (data.image) {
        formData.append("image", data.image);
      }
      if (data.remove_image) {
        formData.append("remove_image", data.remove_image.toString());
      }

      if (id) {
        const res = await Api.put(`/api/products/${id}`, formData);
        return res.data;
      } else {
        formData.append("game_id", data.gameId);
        const res = await Api.post(`/api/products`, formData);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["product", id] });
      }
    },
  });
};
