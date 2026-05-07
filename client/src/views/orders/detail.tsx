import { Link, useParams } from "react-router";
import { useOrder } from "../../hooks/order/useOrder";
import { formattedPrice } from "../../helpers/formatted_price";
import { useContext, useEffect } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";
import { useOrderStatus } from "../../hooks/order/useOrderStatus";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import RestrictedPage from "../restricted";
import { generateInvoice } from "../../helpers/create_invoice";
import TopNavbar from "../../components/top_navbar";

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext)!;
  const { data: order, isLoading } = useOrder(id);

  const isSeller = user?.id === order?.seller_id;

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

  const { mutate } = useOrderStatus();

  const handleUpdateStatus = (status: string) => {
    mutate(
      {
        order_id: order.id,
        status: status,
      },
      {
        onSuccess: () => {
          toast.success("Delivery started");
        },
      },
    );
  };

  

  if (!isLoading && user?.id !== order?.seller_id && user?.id !== order?.user_id) {
  return <RestrictedPage />;
}

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 md:px-0">
      <TopNavbar title="Order detail"/>
      <div className="w-full mt-4">
        <div className="w-full flex justify-between py-3 mb-6">
          <div className="flex flex-col md:flex-row md:gap-3 md:items-center ">
            <div>Invoice {order.invoice}</div>
            <div className="text-xs text-gray-500">
              Placed on {formatDate(order.created_at)}
            </div>
          </div>
          <div>{order.status}</div>
        </div>

        {order.status === "PAID" && (
          <div className="mb-4">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-4">
              <div className="font-medium mb-1">
                {isSeller
                  ? "Ready to start delivery?"
                  : "Waiting for seller to start delivery"}
              </div>

              <p className="text-sm">
                {isSeller ? (
                  <>
                    Once you start, this order will move to{" "}
                    <span className="font-medium">In Progress</span>. Make sure
                    you are ready to deliver the product to the buyer.
                  </>
                ) : (
                  <>
                    Your order has been paid successfully. The seller will start
                    processing your order soon. You will be notified once
                    delivery begins.
                  </>
                )}
              </p>
            </div>

            {isSeller && (
              <div className="mb-4">
                <button
                  onClick={() => handleUpdateStatus("DELIVERING")}
                  className="px-5 py-2 bg-secondary1 text-white rounded-md transition"
                >
                  Start Deliver
                </button>
              </div>
            )}
          </div>
        )}

        {order.status === "DELIVERING" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-4">
            <div className="font-medium mb-1">
              {isSeller
                ? "Delivery in progress"
                : "Your order is being delivered"}
            </div>

            <p className="text-sm">
              {isSeller ? (
                <>
                  You are currently delivering this order. Keep the buyer
                  updated and make sure everything is completed properly.
                </>
              ) : (
                <>
                  The seller is currently working on your order. You will be
                  notified once the delivery is completed.
                </>
              )}
            </p>

            {isSeller && (
              <button
                onClick={() => handleUpdateStatus("DELIVERED")}
                className="mt-3 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Finish Delivery
              </button>
            )}
          </div>
        )}

        {order.status === "DELIVERED" && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-4">
            <div className="font-medium mb-1">
              {isSeller ? "Delivery completed" : "Order delivered"}
            </div>

            <p className="text-sm">
              {isSeller ? (
                <>
                  This order has been successfully delivered. Waiting for buyer
                  confirmation or system verification.
                </>
              ) : (
                <>
                  Your order has been delivered. Please review and confirm if
                  everything is correct.
                </>
              )}
            </p>

            {!isSeller && (
              <button
                onClick={() => handleUpdateStatus("CONFIRMED")}
                className="mt-3 px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition"
              >
                Confirm Received
              </button>
            )}
          </div>
        )}
        {order.status != "PAID" && (
          <>
            {order.order_log?.map((log: any) => (
              <div className="grid grid-cols-7" key={log.id}>
                <div className="col-span-1 text-gray-500 text-xs">
                  {formatDate(log.created_at)}
                </div>
                <div className="col-span-6 flex-1  text-text text-xs mb-4">
                  {log.title}
                </div>
              </div>
            ))}
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

                  <Link className="p-3 bg-secondary1 rounded-md text-bg flex gap-2 items-center" to={"/chat/order/"+order.id}>
                    <IoChatbubbleEllipses />
                    chat
                  </Link>
                </div>
                {isSeller ? (
                  <div className="mt-2 text-sm ">
                  bought by:{" "}
                  <span className="underline">{order.user.name}</span>
                </div>
                ) : (
                  <div className="mt-2 text-sm ">
                  Seller :{" "}
                  <span className="underline">{order.seller.name}</span>
                </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-medium">Order summary</span>
              <div className="md:grid md:grid-cols-2 mt-4 gap-3">
                <div className="col-span-1 space-y-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Brand game</span>
                    <span className="text-sm text-text">{order.product.game.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Quantity</span>
                    <span className="text-sm text-text">{order.qty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Unit price</span>
                    <span className="text-sm text-text">
                      {formattedPrice(order.product.price)}{" "}
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
                      {formattedPrice(0.05 * order.total)}{" "}
                      <span className="text-xs">IDR</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:grid grid-cols-2 mt-4 gap-3">
                <div className="col-span-1"></div>
                <div className="col-span-1 bg-surface p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-text font-medium">Earning</span>
                    <span className="text-text font-medium">
                      {formattedPrice(order.total - 0.05 * order.total)}{" "}
                      <span className="text-xs">IDR</span>
                    </span>
                  </div>

                  <span className="text-gray-500 text-sm">
                    Final amount is based on actual quantity delivered.
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] p-5 mt-6 rounded-md mb-8 md:flex gap-3">
              <span>
                Invoice available to download after payment has been released.{" "}
              </span>
              <span className="inline-flex items-center gap-1">
                <FaDownload className={`${order.status === "CONFIRMED" ? "" : "text-gray1"}`} />
                <button disabled={order.status !== "CONFIRMED"} onClick={()=>generateInvoice(order, isSeller ? "seller" : "buyer")} className={`${order.status === "CONFIRMED" ? "cursor-pointer" : "text-gray1"} underline `}>Download invoice</button>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default OrderDetail;
