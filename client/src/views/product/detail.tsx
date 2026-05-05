import { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiFillHome, AiOutlineSafetyCertificate } from "react-icons/ai";
import { IoChatbubbles, IoTimerSharp } from "react-icons/io5";
import { RiMedal2Line } from "react-icons/ri";
import { IoMdThumbsUp } from "react-icons/io";
import Footer from "../../components/footer";
import { useGetProductById } from "../../hooks/product/useGetProductById";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import Api from "../../services/api";
import { formattedPrice } from "../../helpers/formatted_price";
import { FaChevronRight, FaStore } from "react-icons/fa6";
import TopNavbar from "../../components/top_navbar";
import { useCreateOrder } from "../../hooks/order/useMakeOrder";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import OrderCard from "../../components/order_card";
import { AuthContext } from "../../context/AuthContext";
import qrCode from "../../assets/qr-code.png";
import { useCallBack } from "../../hooks/order/useCallBack";
import { useOrder } from "../../hooks/order/useOrder";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { GoHome } from "react-icons/go";

const DetailProduct = () => {
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState<number | "">(1);
  const { id } = useParams();
  const { data, isLoading } = useGetProductById(id);
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { user } = useContext(AuthContext)!;

  const location = useLocation();

  useEffect(() => {
    console.log("data nih", data);
  }, [data]);

  const handleAddQuantity = () => {
    if (!data?.stock) return;

    setQuantity((prev) => {
      const current = prev === "" ? 0 : prev;
      return Math.min(data.stock, current + 1);
    });
  };

  const handleMinusQuantity = () => {
    setQuantity((prev) => {
      const current = prev === "" ? 1 : prev;
      return Math.max(1, current - 1);
    });
  };

  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const isClamped = el.scrollHeight > el.clientHeight;
    setIsOverflowing(isClamped);
  }, [data?.description, expanded]);

  type Order = {
    id: string;
    invoice: string;
    total: number;
    status: string;
    created_at: string;
  };

  const [step, setStep] = useState("Review");

  const { mutate } = useCreateOrder();
  const [order, setOrder] = useState<Order | null>(null);

  const handleBuy = () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (Number(data?.stock) < 1) {
      toast.error("Product Sold out");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      toast.error("Quantity not valid");
      return;
    }
    mutate(
      {
        product_id: Number(id),
        qty: Number(quantity),
      },
      {
        onSuccess: (res) => {
          toast.success("Order created");
          setOrder(res);
          console.log("res", res);
          setStep("PENDING");
        },
        onError: (error: any) => {
          const status = error?.response?.status;

          if (status === 403) {
            setStep("FORBIDDEN");
            return;
          }
          const message =
            error?.response?.data?.message || "Failed to make order";

          toast.error(message);
        },
      },
    );
  };

  const handleClickBuyNow = () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }
    dialogRef.current?.showModal();
  };

  const EXPIRED_TIME = 15 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (!order?.created_at) return;

    const expiredAt = new Date(order.created_at).getTime() + EXPIRED_TIME;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = expiredAt - now;

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        return;
      }

      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  const formatTime = (ms: any) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const [status, setStatus] = useState<string>();
  const { mutate: callBackMutate } = useCallBack();

  const handleSetCallback = (callback: string) => {
    if (!order) return;
    callBackMutate(
      {
        order_id: order.id,
        status: callback,
      },
      {
        onSuccess: (res) => {
          setStatus(res.status);
        },
      },
    );
  };
  const { data: orderData, refetch } = useOrder(order?.id);

  useEffect(() => {
    if (!order) return;

    if (orderData?.status) {
      setStep(orderData.status);
    }
    console.log("step", step);
  }, [orderData]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <TopNavbar title="Product detail" />
      <div className="max-w-6xl mx-auto w-full">
        <div className="mt-6 md:mt-10 flex gap-2 items-center text-gray-500">
          <GoHome
            onClick={() => navigate("/")}
            className="w-5 h-5 hover:text-secondary1 cursor-pointer"
          />
          <span>{">"}</span>
          <button
            onClick={() => navigate("/brands")}
            className="text-text hover:text-secondary1 cursor-pointer"
          >
            All brand
          </button>

          <span>{">"}</span>
          <button
            onClick={() => navigate("/products?brand=" + data.game.id)}
            className="text-text hover:text-secondary1 cursor-pointer"
          >
            {data.game.name}
          </button>
        </div>
        <div className="grid grid-cols-5 md:gap-8 px-3 md:px-0">
          <div className="col-span-5 md:col-span-3 py-4 overflow-y-auto no-scrollbar">
            <img
              src={
                data.image
                  ? `${Api.defaults.baseURL}/images/products/${data.image}`
                  : `${Api.defaults.baseURL}/images/games/covers/${data.game.image}`
              }
              alt=""
              className="w-full aspect-[1.8/1] rounded-xl object-cover"
            />
            <h1 className="text-4xl font-bold mt-8 text-text">{data.title}</h1>
            <div className="mt-8 rounded-lg py-4">
              <div className="w-full py-4 border-b border-gray-200 text-2xl font-bold text-text">
                Product Info
              </div>
              <div className="grid grid-cols-8 relative py-4">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[linear-gradient(to_right,#d1d5db_50%,transparent_0%)] bg-[length:15px_1px] " />
                <div className="col-span-2 text-lg text-text">Brand</div>
                <div className="col-span-2 text-lg font-semibold text-text">
                  {data.game.name}
                </div>
              </div>
              <div className="p-4">
                <p
                  ref={textRef}
                  className={`text-text ${expanded ? "" : "line-clamp-5"}`}
                >
                  {data.description}
                </p>
              </div>
              {isOverflowing && (
                <div className="w-full flex justify-center p-4 items-center">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="py-2 px-4 text-neutral hover:bg-surface rounded-lg"
                  >
                    {expanded ? (
                      <div className="flex items-center gap-2 text-text">
                        <span className="font-semibold text-lg ">
                          Lebih sedikit
                        </span>
                        <IoIosArrowUp className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-text">
                        <span className="font-semibold text-lg ">
                          Lebih banyak
                        </span>
                        <IoIosArrowDown className="w-6 h-6" />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-5 md:col-span-2 w-full py-4 flex flex-col">
            <div className="w-full flex justify-between bg-[#eef4ff] py-4 px-8 rounded-xl shadow-sm">
              <div className="flex gap-2 items-center">
                <AiOutlineSafetyCertificate className="w-8 h-8 text-[#005386]" />
                <span className="text-lg text-[#005386] font-semibold">
                  Free insuranse
                </span>
              </div>
              <div className="text-lg text-[#005386]">{data.guarantee} day</div>
            </div>
            <div className="w-full bg-bg flex flex-col py-2 mt-6 rounded-xl">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <img
                    src={`${Api.defaults.baseURL}/images/users/${data.user.picture}`}
                    alt=""
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="font-semibold text-text">
                    {data.user.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="hidden md:block p-2 text-bg bg-secondary1 rounded-md cursor-pointer"
                    onClick={() => navigate("/chat/offer/" + data.id)}
                  >
                    <IoChatbubbles className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-2 rounded-md font-semibold text-bg text-center text-lg bg-secondary1 cursor-pointer flex items-center gap-2">
                    <FaStore />
                    <span>Visit store</span>
                  </div>
                </div>
              </div>
              <div className="items-start space-y-3 mt-8">
                <div className="px-4 py-1 bg-surface rounded-full w-fit flex gap-1 items-center">
                  <RiMedal2Line className="text-blue-500" />
                  <span className="text-text text-sm">
                    99% Suceesfull delivery
                  </span>
                </div>
                <div className="px-4 py-1 bg-surface rounded-full w-fit flex gap-1 items-center">
                  <IoTimerSharp className="text-[#FFA500]" />
                  <span className="text-text text-sm">Join 27 Nov 2019</span>
                </div>
                <div className="px-4 py-1 bg-surface rounded-full w-fit flex gap-1 items-center">
                  <IoMdThumbsUp className="text-green-500" />
                  <span className="text-text text-sm ">
                    97% All time rating
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full bg-bg flex flex-col justify-center items-center gap-8 mt-4 rounded-xl">
              <span className="text-gray-500 text-center">
                {data.stock} Available
              </span>
              <div className="flex w-fit justify-between gap-16 items-center border border-gray-300 rounded-full px-2 py-2 shadow-md">
                <div
                  className="aspect-square w-10 flex items-center justify-center  rounded-full  bg-gray-100 text-xl font-bold text-gray-500 cursor-pointer"
                  onClick={handleMinusQuantity}
                >
                  -
                </div>
                <input
                  className="w-12 text-center bg-transparent outline-none text-text"
                  min="1"
                  max={data?.stock}
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (val === "") {
                      setQuantity("");
                      return;
                    }

                    let num = Number(val);

                    if (num < 1) num = 1;
                    if (num > data?.stock) num = data.stock;

                    setQuantity(num);
                  }}
                  onBlur={() => {
                    if (quantity === "" || quantity < 1) {
                      setQuantity(1);
                    }
                  }}
                />
                <div
                  className="aspect-square w-10 flex items-center justify-center  rounded-full  bg-gray-100 text-xl font-bold text-gray-500 cursor-pointer"
                  onClick={handleAddQuantity}
                >
                  +
                </div>
              </div>
              <hr className="border-gray-300 w-full " />
              {data?.stock === 0 ? (
                <div className="border-3 border-red-500 rounded-xl text-2xl font-bold text-red-500 py-3 px-5 -rotate-3">
                  Sold out
                </div>
              ) : (
                <div className="flex w-full justify-between py-5">
                  <span className="text-2xl font-bold text-gray-500">
                    Total Amount
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className="text-2xl font-bold text-gray-500">
                      Rp. {formattedPrice(data.price * (quantity || 0))}
                    </span>
                    <span className="text-sm text-gray-500">IDR</span>
                  </div>
                </div>
              )}
              <button
                className={` ${data?.stock === 0 ? "cursor-not-allowed" : "cursor-pointer"} hidden md:block w-full p-5 rounded-xl bg-secondary1 text-bg text-2xl text-center font-bold `}
                onClick={handleClickBuyNow}
                disabled={data?.stock === 0}
              >
                Buy Now
              </button>

              <dialog
                ref={dialogRef}
                className="modal modal-bottom sm:modal-middle"
              >
                <div className="modal-box bg-bg">
                  {step === "Review" && (
                    <div>
                      <span className="text-3xl font-semibold text-text">
                        Review order
                      </span>
                      <div className=" border-b border-t border-gray-300 py-4">
                        <OrderCard
                          key={data.id}
                          brand={data.game.name}
                          image={
                            data.image
                              ? `${Api.defaults.baseURL}/images/products/${data.image}`
                              : `${Api.defaults.baseURL}/images/games/covers/${data.game.image}`
                          }
                          title={data.title}
                        />
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-300 text-text">
                        <div className="flex flex-col ">
                          <span>Qty</span>
                          <span>Tax</span>
                          <span className="text-lg font-medium">Total</span>
                        </div>
                        <div className="flex flex-col text-end">
                          <span>{quantity}</span>
                          <span>free</span>
                          <span className="text-lg font-medium">
                            Rp. {formattedPrice(data.price * (quantity || 0))}
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-semibold flex justify-center mt-4">
                        Customer detail
                      </span>
                      <div className="grid grid-cols-2 gap-y-3 py-2 border-b border-gray-300 items-center text-text">
                        <span>Name</span>
                        <input
                          type="text"
                          disabled
                          className="input w-full bg-surface text-text"
                          value={user?.name}
                        />

                        <span>Email</span>
                        <input
                          type="text"
                          disabled
                          className="input w-full bg-surface text-text"
                          value={user?.email}
                        />

                        <span>Phone number</span>
                        <input
                          type="number"
                          className="input w-full bg-surface text-text"
                          placeholder="ex: 08xxxxxx"
                        />
                      </div>
                      <div className="modal-action">
                        <button
                          className="bg-secondary1 text-bg px-4 font-medium rounded-md cursor-pointer"
                          onClick={() => handleBuy()}
                        >
                          Proceed Payment
                        </button>
                        <form method="dialog">
                          <button className="px-4 py-2 rounded-md bg-red-500 text-bg font-medium">
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                  {step === "PENDING" && (
                    <div className="flex flex-col">
                      <div>
                        <span className="text-3xl font-semibold py-4 text-text">
                          Payment | Demo
                        </span>
                        <div className="py-4 flex gap-2 text-lg font-medium text-text">
                          <span>
                            {status
                              ? `Status : ${status}`
                              : "Set demo callback : "}{" "}
                          </span>
                          {!status && (
                            <div className="flex gap-2">
                              <button
                                className="bg-green-500 px-4 py-1 rounded-md shadow-md font-medium text-bg"
                                onClick={() => handleSetCallback("PAID")}
                              >
                                Paid
                              </button>
                              <button
                                className="bg-red-500 px-4 py-1 rounded-md shadow-md font-medium text-bg"
                                onClick={() => handleSetCallback("FAILED")}
                              >
                                Failed
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col bg-surface px-6 -mx-6">
                        <span className="text-3xl font-semibold py-3 text-text">
                          Rp. {formattedPrice(order?.total ?? 0)}
                        </span>
                        <span className="text-sm text-gray-500 pb-3">
                          Invoice ID: {order?.invoice}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800 bg-gray-200 py-1 text-center -mx-6 ">
                        Pay within: {formatTime(timeLeft)}
                      </span>
                      <div className=" flex justify-center items-center my-6">
                        <img src={qrCode} alt="qr code" className="w-60" />
                      </div>
                      <details
                        className="collapse collapse-arrow bg-surface "
                        name="my-accordion-det-1"
                        open
                      >
                        <summary className="collapse-title font-semibold text-text">
                          How to pay?
                        </summary>
                        <div className="p-4">
                          <ul className="list-decimal pl-5 text-text">
                            <li>
                              Open your Gojek, GoPay or other e-wallet app.
                            </li>
                            <li>Download or scan QRIS on your monitor.</li>
                            <li>Confirm payment in the app.</li>
                            <li>Payment completed.</li>
                          </ul>
                        </div>
                      </details>
                      <a
                        href={qrCode}
                        download="qris.png"
                        className="w-full flex items-center justify-center px-6  items-center mt-3"
                      >
                        <button className="w-full bg-surface py-3 rounded-xl text-2xl cursor-pointer text-text">
                          Download QRIS
                        </button>
                      </a>
                      <div className="w-full flex items-center justify-center px-6  items-center mt-3 ">
                        <button
                          className="w-full  py-3 rounded-xl text-2xl bg-secondary1 text-bg cursor-pointer"
                          onClick={() => refetch()}
                        >
                          Check status
                        </button>
                      </div>
                    </div>
                  )}
                  {step === "PAID" && (
                    <div className="-m-6">
                      <div className="bg-green-100 w-full flex flex-col items-center justify-center py-40">
                        <FaCheckCircle className="w-20 h-20 text-green-700" />
                        <span className="text-2xl font-semibold mt-6">
                          Your payment was received
                        </span>
                        <span className="text-center mt-2">
                          We have confirmed your payment. Your order is now
                          being processed.
                        </span>
                      </div>
                      <div className="p-8 pt-30">
                        <button className="py-3 w-full px-6 rounded-md bg-secondary1 text-bg font-medium">
                          Go to order page
                        </button>
                      </div>
                    </div>
                  )}

                  {step === "FAILED" && (
                    <div className="-m-6">
                      <div className="bg-red-100 w-full flex flex-col items-center justify-center py-40">
                        <FaTimesCircle className="w-20 h-20 text-red-600" />
                        <span className="text-2xl font-semibold mt-6">
                          Payment failed
                        </span>
                        <span className="text-center mt-2">
                          Your payment could not be processed. Please try again.
                        </span>
                      </div>
                      <div className="p-8 pt-30 flex gap-3">
                        <button
                          onClick={() => {
                            setStatus("");
                            handleBuy();
                          }}
                          className="py-3 w-full px-6 rounded-md bg-secondary1 text-bg font-medium"
                        >
                          Try Again
                        </button>
                        <form method="dialog">
                          <button className="py-3 w-full px-6 rounded-md bg-gray-300 font-medium">
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {step === "EXPIRED" && (
                    <div className="-m-6">
                      <div className="bg-yellow-100 w-full flex flex-col items-center justify-center py-40">
                        <FaExclamationCircle className="w-20 h-20 text-yellow-600" />
                        <span className="text-2xl font-semibold mt-6">
                          Payment expired
                        </span>
                        <span className="text-center mt-2">
                          Your payment time has expired. Please create a new
                          order to continue.
                        </span>
                      </div>
                      <div className="p-8 pt-30 flex gap-3">
                        <button
                          onClick={() => {
                            setStatus("");
                            handleBuy();
                          }}
                          className="py-3 w-full px-6 rounded-md bg-secondary1 text-bg font-medium"
                        >
                          Order Again
                        </button>
                        <form method="dialog">
                          <button className="py-3 w-full px-6 rounded-md bg-gray-300 font-medium">
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {step === "FORBIDDEN" && (
                    <div className="-m-6">
                      <div className="bg-red-100 w-full flex flex-col items-center justify-center py-30">
                        <FaTimesCircle className="w-20 h-20 text-red-600" />
                        <span className="text-2xl font-semibold mt-6">
                          Action not allowed
                        </span>
                        <span className="text-center mt-2 px-6">
                          You cannot buy your own product. Please choose another
                          item.
                        </span>
                      </div>

                      <div className="p-8 pt-30 flex gap-3">
                        <form method="dialog" className="w-full">
                          <button className="py-3 w-full px-6 rounded-md bg-gray-300 font-medium">
                            Close
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
      <div className="block md:hidden fixed w-full bg-bg bottom-0 left-0 p-4">
        <div className="flex w-full justify-between md:justify-end gap-4 px-4 items-center">
          <div
            className="col-span-1 w-full md:w-auto font-bold p-4 md:p-3 rounded text-center border border-[#C5A16F] dark:border-text md:border-none text-[#C5A16F] dark:text-text flex items-center gap-3 justify-center"
            onClick={() => navigate("/chat/offer/" + data.id)}
          >
            <IoChatbubbles className="w-6 h-6" />
            <span>Chat</span>
          </div>
          <button
            className={`${data?.stock === 0 ? "cursor-not-allowed" : "cursor-pointer"} w-full md:w-auto bg-[#C5A16F] hover:bg-gray-700 cursor-pointer text-bg font-medium p-4 md:p-3 rounded text-center`}
            onClick={handleClickBuyNow}
            disabled={data?.stock === 0}
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};
export default DetailProduct;
