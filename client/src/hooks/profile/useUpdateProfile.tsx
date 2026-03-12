// import useMutation dari '@tanstack/react-query';
import { useMutation } from "@tanstack/react-query";

//import service API
import Api from "../../services/api";
import Cookies from "js-cookie";


export const useUpdateProfile = () => {
  return useMutation({
    // mutation untuk register
    mutationFn: async ({ id, data }: { id: number; data:FormData}) => {
      const token = Cookies.get("token");
      //menggunakan service API untuk register
      const response = await Api.patch(`/api/users/${id}`, data, {
        headers: {
         "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      //mengembalikan response data
      return response.data;
    },
  });
};
