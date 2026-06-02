import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

type UpdateStatusData = {
  ids: number[];
  status: string;
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateStatusData) => {
      const response = await Api.patch(`/api/products/status`, {
        ids: data.ids,
        status: data.status,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
