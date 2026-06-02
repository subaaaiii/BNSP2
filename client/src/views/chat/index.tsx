import { useContext, useEffect, useState, useRef, useMemo } from "react";
import Pusher from "pusher-js";
import { AuthContext } from "../../context/AuthContext";
import { useChatList } from "../../hooks/chat/useChatList";
import Api from "../../services/api";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { CiSearch } from "react-icons/ci";
import banner_hero from "../../assets/banner_hero2.png";
import { IoIosArrowBack, IoMdSend } from "react-icons/io";
import { useDebounce } from "../../hooks/helpers/useDebounce";
import { useTheme } from "../../context/ThemeContext";
import { useGetProductById } from "../../hooks/product/useGetProductById";
import toast from "react-hot-toast";
import CardSimple from "../../components/card_simple";
import { useProductBatch } from "../../hooks/product/useProductBatch";
import { useOrderBatch } from "../../hooks/order/useOrderBatch";
import { useOrder } from "../../hooks/order/useOrder";
import OrderCardSimple from "../../components/order_card_simple";

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [targetUserId, setTargetUserId] = useState("");

  const location = useLocation();

  const isProductChat = location.pathname.includes("/chat/offer");

  const [askProduct, SetAskProduct] = useState(false);
  useEffect(() => {
    if (isProductChat) {
      SetAskProduct(true);
      setInput("May I know this offer available and how long delivery takes");
    }
  }, [isProductChat]);

  const isOrderChat = location.pathname.includes("/chat/order");
  const [askOrder, SetAskOrder] = useState(false);

  useEffect(() => {
    if (isOrderChat) {
      SetAskOrder(true);
      setInput("Let's talk about this order");
    }
  }, [isOrderChat]);

  const idFetchOder = isOrderChat ? id : undefined;

  const { data: orderData } = useOrder(idFetchOder);

  const idFetchProduct = isProductChat ? id : undefined;

  const { data: product } = useGetProductById(idFetchProduct);

  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !product) return;

    if (String(product.user.id) === String(user?.id)) {
      toast.error("You cannot message yourself");
      navigate("/chat");
      return;
    }

    setTargetUserId(product.user.id);
  }, [id, product, user]);

  useEffect(() => {
    if (!id || !orderData || !user?.id) return;

    let targetId = "";

    if (String(user.id) === String(orderData.user_id)) {
      targetId = orderData.seller_id;
    } else if (String(user.id) === String(orderData.seller_id)) {
      targetId = orderData.user_id;
    }

    if (!targetId) return;

    setTargetUserId(String(targetId));
  }, [id, orderData, user]);

  useEffect(() => {
    console.log("data order", orderData);
  }, [orderData]);

  useEffect(() => {
    if (!id) {
      setTargetUserId("");
    }
  }, [id]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user?.id) return;

    const pusher = new Pusher("1445018101705e987746", {
      cluster: "ap1",
      authEndpoint: `${Api.defaults.baseURL}/pusher/auth`,
    });

    const channel = pusher.subscribe(`private-chat-${user.id}`);

    channel.bind("new-message", (data: any) => {
      console.log("RECEIVED:", data);
      setMessages((prev) => {
        const newMessages = [...prev, data];
        return newMessages;
      });
    });

    return () => {
      pusher.unsubscribe(`private-chat-${user.id}`);
      pusher.disconnect();
    };
  }, [user?.id]);

  const sendMessage = async () => {
    if (!input || !targetUserId) return;

    const payload: any = {
      to: targetUserId.toString(),
      message: input,
    };

    if (askOrder) {
      payload.order_id = id;
    }
    if (askProduct) {
      payload.product_id = id;
    }

    try {
      await Api.post("/api/chat/send", payload);
      setInput("");
      SetAskProduct(false);
      SetAskOrder(false);
      const refreshed = await Api.get("/api/chat/messages", {
        params: { target_id: targetUserId }
      });

      setMessages(Array.isArray(refreshed.data) ? refreshed.data : []);
    } catch (err: any) {
      if (err.response) {
        console.error("Server error:", err.response.data);
        alert(err.response.data.error || "Server error");
      } else if (err.request) {
        console.error("No response:", err.request);
        alert("Server not resond");
      } else {
        console.error("Error:", err.message);
        alert(err.message);
      }
    }
  };

  const [query, setQuery] = useState("");

  const debouncedTarget = useDebounce(targetUserId, 500);
  const debouncedSearch = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedTarget) return;

    Api.get("/api/chat/messages", {
      params: { target_id: debouncedTarget }
    }).then((res) => {
      setMessages(Array.isArray(res.data) ? res.data : []);
    });
  }, [debouncedTarget]);

  const { data: chatList } = useChatList({ q: debouncedSearch });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (ts: any) => {
    return new Date(ts * 1000).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateGroup = (date: number) => {
    const d = new Date(date * 1000);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a: Date, b: Date) =>
      a.toDateString() === b.toDateString();

    if (isSameDay(d, today)) return "Today";
    if (isSameDay(d, yesterday)) return "Yesterday";

    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const activeChat = Array.isArray(chatList)
    ? chatList.find((c: any) => String(c.user_id) === String(targetUserId))
    : null;

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  const productIds = useMemo(() => {
    return [
      ...new Set(
        messages.map((m) => m.product_id).filter((id): id is number => !!id),
      ),
    ];
  }, [messages]);

  const orderIds = useMemo(() => {
    return [
      ...new Set(
        messages.map((m) => m.order_id).filter((id): id is string => !!id),
      ),
    ];
  }, [messages]);

  const { data: products } = useProductBatch(productIds);
  const { data: orders } = useOrderBatch(orderIds);

  const productMap = Object.fromEntries(
    (products || []).map((p: any) => [p.id, p]),
  );

  const orderMap = Object.fromEntries(
    (orders || []).map((o: any) => [o.id, o]),
  );

  return (
    <div className=" max-w-7xl mx-auto shadow grid grid-cols-4 -mt-20 -mb-20">
      <div
        className={`${targetUserId ? "hidden md:block" : "block "} col-span-4 md:col-span-1 border-r border-gray-200 `}
      >
        <div className="flex justify-between py-6 items-center px-3">
          <Link
            to="/"
            className="text-xl font-bold text-[#C5A16F]
          "
          >
            SubGAME
          </Link>
          <div className="relative" ref={dropdownRef}>
            <div
              className="avatar cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            >
              <div className="w-9 rounded-full">
                <img
                  alt="avatar"
                  src={`${Api.defaults.baseURL}/images/users/${user?.picture}`}
                />
              </div>
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-70 bg-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1),0_0_10px_rgba(0,0,0,0.05)] z-50 overflow-hidden">
                <div className="flex flex-row items-center gap-3 p-3 border-b border-gray-300">
                  <div className="avatar cursor-pointer">
                    <div className="w-9 rounded-full">
                      <img
                        alt="avatar"
                        src={`${Api.defaults.baseURL}/images/users/${user?.picture}`}
                      />
                    </div>
                  </div>
                  <div className="px-3 ">
                    <h2 className="font-medium text-text">{user?.username}</h2>
                    <p className="text-sm text-gray-500 dark:text-white ">
                      Type user: {user?.role}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-white">
                      Account ID: {user?.id}
                    </p>
                  </div>
                </div>
                <button className="w-full px-3  text-left  py-3 hover:bg-surface-hover text-sm text-text">
                  Profile
                </button>
                <button className="w-full flex justify-between px-3  py-3 hover:bg-surface-hover text-sm text-text">
                  <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
                  <input
                    type="checkbox"
                    checked={theme == "dark"}
                    className={`toggle`}
                    onClick={toggleTheme}
                  />
                </button>
                <button className="w-full px-3 text-left py-3 hover:bg-red-100 text-red-500 text-sm">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="relative mb-4 px-3">
          <input
            type="text"
            className="input rounded-full pl-10 w-full"
            placeholder="Find with name"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <CiSearch className="w-6 h-6 text-gray-500" />
          </div>
        </div>
        {chatList?.map((list: any) => (
          <div
            key={list.user_id}
            className={`space-y-3 flex justify-between items-center hover:bg-surface-hover px-3 py-2 cursor-pointer ${list.user_id === activeChat?.user_id ? "bg-surface" : ""}`}
            onClick={() => {
              setTargetUserId(list.user_id);
              SetAskOrder(false);
              SetAskProduct(false);
              setInput("");
            }}
          >
            <div className="flex gap-2 items-center min-w-0 overflow-hidden">
              <div className="">
                <img
                  src={`${Api.defaults.baseURL}/images/users/${list.picture}`}
                  alt={list.picture}
                  className="w-12 h-12 object-cover rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text">{list.name}</div>
                <span className="text-sm text-gray-500 truncate block">
                  {list.message}
                </span>
              </div>
            </div>
            <div className="text-text text-sm flex-shrink-0">
              {formatDate(list.created_at)}
            </div>
          </div>
        ))}
      </div>
      <div
        className={`${targetUserId ? "block" : "hidden md:block"} col-span-4 md:col-span-3 h-screen relative flex flex-col`}
      >
        {targetUserId ? (
          <div className="">
            <div className="font-semibold text-text px-4 py-4 flex gap-3 items-center">
              <div
                onClick={() => setTargetUserId("")}
                className="block md:hidden"
              >
                <IoIosArrowBack className="w-5 h-5" />
              </div>
              {activeChat?.name || product?.user?.name}
            </div>
            <hr className="border-gray-300" />

            {/* messages */}
            <div className="flex-1 px-4 overflow-y-auto h-[calc(100vh-140px)] pb-5 pt-4">
              {messages?.map((msg, i) => {
                const currentDate = new Date(
                  msg.timestamp * 1000,
                ).toDateString();
                const prevDate =
                  i > 0
                    ? new Date(messages[i - 1].timestamp * 1000).toDateString()
                    : null;

                const showDate = currentDate !== prevDate;

                return (
                  <div key={i}>
                    {showDate && (
                      <div className="flex justify-center my-3 relative">
                        <span className="text-xs bg-surface z-4 text-gray1 px-5 py-1 rounded-full">
                          {formatDateGroup(msg.timestamp)}
                        </span>
                        <hr className="h-[1px] w-full bg-gray-200 border-0 absolute top-1/2 translate-y-1/2 z-2" />
                      </div>
                    )}

                    {/*  message */}
                    <div
                      className={`mb-2 flex w-full ${
                        String(msg.from) === String(user?.id)
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="min-w-20 max-w-[80%] ">
                        <div className="mb-2">
                          {msg.product_id && productMap[msg.product_id] && (
                            <div
                              className={`px-3 py-2 rounded-lg ${
                                String(msg.from) === String(user?.id)
                                  ? "bg-bgchat"
                                  : "bg-surface"
                              }`}
                            >
                              <div className="py-2">
                                <span className="font-semibold text-text">
                                  offer{" "}
                                </span>
                                <span className="text-sm text-gray1">
                                  (#{msg.product_id})
                                </span>
                              </div>
                              <hr className="border-gray-300 -mx-3" />
                              {msg.product_id && (
                                <div>
                                  {productMap[msg.product_id] ? (
                                    <CardSimple
                                      product={productMap[msg.product_id]}
                                    />
                                  ) : (
                                    <div className="text-xs text-gray-400">
                                      Loading product...
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {msg.order_id && orderMap[msg.order_id] && (
                            <div
                              className={`px-3 py-2 rounded-lg ${
                                String(msg.from) === String(user?.id)
                                  ? "bg-bgchat"
                                  : "bg-surface"
                              }`}
                            >
                              <div className="py-2">
                                <span className="font-semibold text-text">
                                  order{" "}
                                </span>
                                <span className="text-sm text-gray1">
                                  (#{orderMap[msg.order_id].invoice})
                                </span>
                              </div>
                              <hr className="border-gray-300 -mx-3" />
                              <OrderCardSimple order={orderMap[msg.order_id]} />
                            </div>
                          )}
                        </div>
                        <div
                          className={`flex flex-col px-3 py-2 rounded-lg ${
                            String(msg.from) === String(user?.id)
                              ? "bg-bgchat"
                              : "bg-surface"
                          }`}
                          ref={bottomRef}
                        >
                          <span className="mb-2 text-text ">{msg.message}</span>
                          <span className="text-right text-xs text-gray-400">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 text-text p-4 ">
              {askProduct && (
                <div className="border rounded-t-lg border-gray-300 bg-bg">
                  <div className="flex justify-between px-4 py-2">
                    <div>
                      <span className="font-semibold text-text">offer </span>
                      <span className="text-sm text-gray-500">
                        (#{product.id})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        SetAskProduct(false);
                        setInput("");
                      }}
                    >
                      x
                    </button>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="px-4">
                    <CardSimple
                      key={product.id}
                      product={product}
                      onClick={() => navigate("/products/detail/" + product.id)}
                    />
                  </div>
                </div>
              )}
              {askOrder && (
                <div className="border rounded-t-lg border-gray-300 bg-bg">
                  <div className="flex justify-between px-4 py-2">
                    <div>
                      <span className="font-semibold text-text">order </span>
                      <span className="text-sm text-gray-500">
                        (#{orderData.invoice})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        SetAskOrder(false);
                        setInput("");
                      }}
                    >
                      x
                    </button>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="px-4">
                    <OrderCardSimple order={orderData} />
                  </div>
                </div>
              )}
              <div className="max-w-7xl mx-auto flex gap-2 bg-bg border border-gray-300 p-4 rounded-b-lg ">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none   "
                />
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 cursor-pointer text-white rounded-full bg-[#C5A16F] flex justify-center items-center "
                >
                  <IoMdSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full space-y-4">
            <img src={banner_hero} alt="hero" />
            <span className="text-3xl font-semibold text-text">
              Welcome to SubGame Chat
            </span>
            <span className="text-lg text-gray-500">
              Start conversation now
            </span>
            <div className="py-4 px-16 bg-surface flex flex-col text-center">
              <span className="mb-2 text-gray-500">
                Please report to us if you find a seller asking you to
              </span>
              <span className="text-text">
                - Making transactions outside of the SubGame
              </span>
              <span className="text-text">
                - Exchange a product for another item
              </span>
              <span className="mt-2 text-gray-500">
                Beware of potential scam and happy shopping
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
