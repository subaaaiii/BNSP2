import { useParams } from "react-router";
import { useOrder } from "../../hooks/order/useOrder";
import { formattedPrice } from "../../helpers/formatted_price";
import { useEffect } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";

const OrderDetail = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    console.log("order", order);
  }, [order]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="w-full mt-4">
        <div className="w-full flex justify-between py-3 ">
          <div className="flex flex-col md:flex-row md:gap-3 md:items-center ">
            <div>Invoice {order.invoice}</div>
            <div className="text-xs text-gray-500">
              Placed on {formatDate(order.created_at)}
            </div>
          </div>
          <div>{order.status}</div>
        </div>
        <div className="grid grid-cols-7">
          <div className="col-span-1 text-gray-500 text-xs">
            24 januari, 8pm
          </div>
          <div className="col-span-6 flex-1  text-text text-sm mb-4">
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
            fugiat iusto sed. Minus, suscipit, doloremque itaque exercitationem
            sunt amet nisi culpa, eius aperiam nihil totam! Consequuntur omnis
            quasi blanditiis similique?
          </div>
          <div className="col-span-1 text-gray-500 text-xs">
            24 januari, 8pm
          </div>
          <div className="col-span-6 flex-1  text-text text-sm">
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
            fugiat iusto sed. Minus, suscipit, doloremque itaque exercitationem
            sunt amet nisi culpa, eius aperiam nihil totam! Consequuntur omnis
            quasi blanditiis similique?
          </div>
        </div>
        <div
          key={order.id}
          className="w-full bg-bg border border-gray-300 rounded-lg overflow-hidden mt-8 cursor-pointer"
        >
          <div className="grid grid-cols-4 p-4">
            <div className="col-span-4 md:col-span-3 flex flex-col">
              <span className="text-text font-medium">
                {order.product.title}
              </span>
              <span className="text-xs text-gray-500">{order.invoice}</span>
              <span className="mt-2">x{order.qty}</span>
            </div>
            <div className="col-span-4 md:col-span-1 flex flex-col md:flex-row items-end -mt-6 md:mt-0 md:items-center gap-2 justify-between">
              <div>
                {formattedPrice(order.total)}{" "}
                <span className="text-xs">IDR</span>
              </div>

              <div className="p-3 bg-secondary1 rounded-md text-bg flex gap-2 items-center">
                <IoChatbubbleEllipses />
                chat
              </div>
            </div>
            <div className="mt-2 text-sm ">
              bought by: <span className="underline">{order.user.name}</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-medium">Order summary</span>
          <div className="grid grid-cols-2 mt-4 gap-3">
            <div className="col-span-1 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Brand game</span>
                <span className="text-sm text-text">rise of kingdoms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Quantity</span>
                <span className="text-sm text-text">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Unit price</span>
                <span className="text-sm text-text">
                  {formattedPrice(order.total)}{" "}
                  <span className="text-xs">IDR</span>
                </span>
              </div>
            </div>
            <div className="col-span-1 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Order Amount</span>
                <span className="text-sm text-text">
                  {formattedPrice(order.total)}{" "}
                  <span className="text-xs">IDR</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  SubGame Commission fee (5%)
                </span>
                <span className="text-sm text-text">
                  {formattedPrice(order.total)}{" "}
                  <span className="text-xs">IDR</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 mt-4 gap-3">
            <div className="col-span-1"></div>
            <div className="col-span-1 bg-surface p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-text font-medium">Earning</span>
                <span className="text-text font-medium">
                  {formattedPrice(order.total)}{" "}
                  <span className="text-xs">IDR</span>
                </span>
              </div>

              <span className="text-gray-500 text-sm">
                Final amount is based on actual quantity delivered.
              </span>
            </div>
          </div>
        </div>
        <div className="w-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] p-5 mt-6 rounded-md mb-8 flex gap-3">
            <span>Invoice available to download after payment has been released. {"  "}</span>
            <div className="flex items-center gap-1">
                <FaDownload/> 
                <button className="underline">Download invoice</button></div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
