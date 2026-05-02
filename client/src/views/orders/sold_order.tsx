import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/order/useOrders";
import { formattedPrice } from "../../helpers/formatted_price";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("");

  const tabs = [
    { label: "All", value: "", status: "" },
    {
      label: "Pending",
      value: "PENDING",
      status: "Payment pending",
      style: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    {
      label: "Preparing",
      value: "PAID",
      status: "Preparing product",
      style: "bg-indigo-100 text-indigo-700 border-indigo-300",
    },
    {
      label: "Delivering",
      value: "DELIVERING",
      status: "Delivering",
      style: "bg-blue-100 text-blue-700 border-blue-300",
    },
    {
      label: "Completed",
      value: "COMPLETED",
      status: "Completed",
      style: "bg-green-100 text-green-700 border-green-300",
    },
    {
      label: "Cancelled",
      value: "FAILED",
      status: "Payment Failed",
      style: "bg-red-100 text-red-700 border-red-300",
    },
    {
      label: "Expired",
      value: "EXPIRED",
      status: "Payment expired",
      style: "bg-gray-200 text-gray-600 border-gray-300",
    },
  ];

  const { data } = useOrders({
    status: statusFilter,
  });

  const getLabel = (value: string) => {
    const found = tabs.find((tab) => tab.value === value);
    return found ? found.label : value;
  };
  const getStatus = (value: string) => {
    const found = tabs.find((tab) => tab.value === value);
    return found ? found.status : value;
  };
  const getStyle = (value: string) => {
    const found = tabs.find((tab) => tab.value === value);
    return found ? found.style : value;
  };

  const formatDate = (date:string) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const isEmpty = !data || data.length === 0;
const getEmptyText = () => {
  if (!statusFilter) return "No orders yet";

  const tab = tabs.find((t) => t.value === statusFilter);
  return `No ${tab?.label || statusFilter} orders`;
};

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mt-8 mb-4">
        <span className="font-medium text-2xl">Sold Orders</span>
      </div>
      <div className="flex gap-2 cursor-pointer">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={`px-4 py-2  text-gray-500 ${
              statusFilter === tab.value
                ? "border-b-3 border-neutral text-text"
                : ""
            }`}
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg mt-6 bg-surface">
    <div className="text-4xl mb-3">📦</div>

    <div className="text-lg font-medium text-text">
      {getEmptyText()}
    </div>

    <div className="text-sm text-gray-500 mt-1">
      {statusFilter
        ? "Try changing the filter or wait for new orders."
        : "You don’t have any orders yet."}
    </div>

    {statusFilter && (
      <button
        onClick={() => setStatusFilter("")}
        className="mt-4 px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
      >
        View all orders
      </button>
    )}
  </div>
      ):(
        data.map((order: any) => (
        <div
          key={order.id}
          className="w-full bg-bg shadow-md rounded-lg overflow-hidden mt-4"
        >
          <div className="w-full flex justify-between px-4 py-3 bg-surface">
            <div className="flex gap-3 items-center">
              <div>Invoice {order.invoice}</div>
              <div className="text-xs text-gray-500">Placed on {formatDate(order.created_at)}</div>
            </div>
            <div>{getLabel(order.status)}</div>
          </div>
          <div className="grid grid-cols-4 p-4">
            <div className="col-span-3 flex flex-col">
              <span className="text-text font-medium">
                {order.product.title}
              </span>
              <span className="text-xs text-gray-500">{order.invoice}</span>
              <span className="mt-2">x{order.qty}</span>
            </div>
            <div className="col-span-1 flex items-center gap-2 justify-between">
              <div>
                {formattedPrice(order.total)}{" "}
                <span className="text-xs">IDR</span>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs border ${
                  getStyle(order.status) || "bg-gray-100"
                }`}
              >
                {getStatus(order.status)}
              </div>
            </div>
          </div>
        </div>
      ))
      )}
      {}
    </div>
  );
};
export default Orders;
