import { useNavigate } from "react-router";

const OrderCardSimple = ({ order }: any) => {
  const navigate = useNavigate();

  const formatDate = (date:string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formattedPrice = (num:number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div
      className="w-full overflow-hidden cursor-pointer py-2"
      onClick={() => navigate("/orders/detail/" + order?.id)}
    >
      <div className="w-full flex justify-between ">
        <div className="flex flex-col md:flex-row md:gap-3 md:items-center ">
          <div className="text-xs text-gray1">
            Placed on {formatDate(order?.created_at)}
          </div>
        </div>

      </div>

      <div className="flex gap-8 justify-between">
        <div className="flex flex-col">
          <span className="text-text font-medium">
            {order?.product?.title}
          </span>
          <span className="text-xs text-gray1">{order?.invoice}</span>
          <span className="text-text">x{order?.qty}</span>
        </div>

        <div className="flex flex-col  items-end md:items-center gap-2 justify-between">
          <div className="text-text">
            {formattedPrice(order?.total)}{" "}
            <span className="text-xs text-text">IDR</span>
          </div>

          <div className="rounded-full px-3 py-1 text-xs border border-text text-text">
            {order?.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCardSimple;