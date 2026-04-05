import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";

type UpdateStatusData = {
  ids: number[];
  status: string;
};

export const useUpdateStatusSeller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // mutation untuk
    mutationFn: async (data: UpdateStatusData) => {
      const token = Cookies.get("token");
      //menggunakan service API untuk register
      const response = await Api.patch(
        `/api/sellers/status`,
        { ids: data.ids, status: data.status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      //mengembalikan response data
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
    },
  });
};
