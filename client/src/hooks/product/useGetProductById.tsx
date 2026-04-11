import { useQuery } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"

export const useGetProductById = (id?: string) => {
    return useQuery({
        queryKey:["product", id],
        queryFn : async()=>{
            const token = Cookies.get("token");
            const res = await Api.get(`/api/products/${id}`, {
                headers : {
                    Authorization: `Bearer ${token}`}
                },
            );
            return res.data
        },
        enabled: !!id,
    });
}