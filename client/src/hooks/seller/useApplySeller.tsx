import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../services/api";

type ApplySellerRequest = {
  name: string;
  birthday: string;
  gender: string;
  address: string;
  identity_number: string;
  identity_image: File | null;
};

export const useApplySeller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ApplySellerRequest) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("birthday", data.birthday);
      formData.append("gender", data.gender);
      formData.append("address", data.address);
      formData.append("identity_number", data.identity_number);

      if (data.identity_image) {
        formData.append("identity_image", data.identity_image);
      }
      const response = await Api.post(`/api/sellers/register`, formData);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller"] });
    },
  });
};
