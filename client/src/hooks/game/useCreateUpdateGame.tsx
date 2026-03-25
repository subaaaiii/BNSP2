import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Api from "../../services/api";

interface Field {
  name: string;
  label: string;
  type: "text" | "select";
  required: boolean;
  options?: string[];
}

interface CreateUpdateGameRequest {
  name: string;
  image?: File | null;
  fields: Field[];
}

export const useCreateUpdateGame = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdateGameRequest) => {
      const token = Cookies.get("token");

      const formData = new FormData();
      formData.append("name", data.name);
      if (data.image) {
        formData.append("image", data.image);
      }
      formData.append("fields", JSON.stringify(data.fields));

      if (id) {
        const res = await Api.put(`/api/admin/games/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } else {
        const res = await Api.post(`/api/admin/games`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["game", id] });
      }
    },
  });
};
