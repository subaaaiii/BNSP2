import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";

type Seller = {
  id: number;
  identity_number: string;
  identity_image: string;
  status: string;
  user: {
    name: string;
    address: string;
    gender: string;
    birthday: string;
  };
};

export const useSeller = () => {
  return useQuery<Seller[]>({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await Api.get(`/api/sellers`);
      return res.data.data;
    },
  });
};
