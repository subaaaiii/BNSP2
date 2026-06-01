import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

type UpdateProfileData = {
  id: number;
  name: string;
  birthday: string;
  gender: string;
  address: string;
  picture?: File | null;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const token = Cookies.get("token");
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("birthday", data.birthday);
      formData.append("gender", data.gender);
      formData.append("address", data.address);

      if (data.picture) {
        formData.append("picture", data.picture);
      }
      const response = await Api.patch(`/api/users/${data.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      //mengembalikan response data
      return response.data;
    },
    onSuccess: (response, variables) => {
  queryClient.setQueryData(["me"], response.data);
  queryClient.setQueryData(["user", variables.id], response.data);
},
  });
};
