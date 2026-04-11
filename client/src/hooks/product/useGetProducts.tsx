import { useQuery } from "@tanstack/react-query"
import Api from "../../services/api"
import Cookies from "js-cookie"

export const useGetProducts = () => {
    return useQuery({
        queryKey:["products"],
        queryFn : async()=>{
            const token = Cookies.get("token");
            const res = await Api.get("/api/products", {
                headers : {
                    Authorization: `Bearer ${token}`}
                },
            );
            return res.data.data
        },
    });
}