import { useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import { useChatList } from "../hooks/chat/useChatList";
import Api from "../services/api";
import { Link } from "react-router";
import { CiSearch } from "react-icons/ci";
import banner_hero from "../assets/banner_hero.png";

const ChatTest = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [targetUserId, setTargetUserId] = useState(""); // 🔥 input target

  const { user } = useContext(AuthContext)!;
  const token = Cookies.get("token");

  useEffect(() => {
    if (!user?.id || !token) return;

    const pusher = new Pusher("1445018101705e987746", {
      cluster: "ap1",
      authEndpoint: "http://localhost:8080/pusher/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const channel = pusher.subscribe(`private-chat-${user.id}`);

    channel.bind("new-message", (data: any) => {
      console.log("RECEIVED:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe(`private-chat-${user.id}`);
      pusher.disconnect();
    };
  }, [user?.id, token]); // 🔥 penting

  const sendMessage = async () => {
    if (!input || !targetUserId) return;

    try {
      console.log("hey ini target", targetUserId);
      console.log("hey ini input", input);

      const res = await axios.post(
        "http://localhost:8080/api/chat/send",
        {
          to: targetUserId.toString(),
          message: input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("SUCCESS:", res.data);

      setInput("");
    } catch (err: any) {
      console.error("ERROR:", err);

      // 🔥 ambil error dari backend kalau ada
      if (err.response) {
        console.error("Server error:", err.response.data);
        alert(err.response.data.error || "Server error");
      } else if (err.request) {
        console.error("No response:", err.request);
        alert("Server tidak merespon");
      } else {
        console.error("Error:", err.message);
        alert(err.message);
      }
    }
  };

  const [debouncedTarget, setDebouncedTarget] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTarget(targetUserId);
    }, 500); // ⏱️ delay 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [targetUserId]);

  useEffect(() => {
    if (!debouncedTarget) return;

    axios
      .get("http://localhost:8080/api/chat/messages", {
        params: { target_id: debouncedTarget },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  }, [debouncedTarget]);

  const { data: chatList } = useChatList();

  useEffect(() => {
    console.log("list", chatList);
  }, [chatList]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [openChat, setOpenChat] = useState<any>(null);

  return (
    <div className=" max-w-7xl mx-auto shadow grid grid-cols-4 -mt-20 ">
      <div className="col-span-1 border-r border-gray-200 px-3 ">
        <div className="flex justify-between py-6 items-center">
          <Link
          to="/"
          className="text-xl font-bold text-[#C5A16F]
          "
        >
          SubGAME
        </Link>
          <div className="avatar cursor-pointer">
          <div className="w-9 rounded-full">
                  <img
                    alt="avatar"
                    src={`${Api.defaults.baseURL}/images/users/${user?.picture}`}
                  />
          </div>
          </div>
          {/* <div className="flex flex-row items-center gap-3 space-y-2">
              <div className="avatar cursor-pointer">
                <div className="w-9 rounded-full">
                  <img
                    alt="avatar"
                    src={`${Api.defaults.baseURL}/images/users/${user?.picture}`}
                  />
                </div>
              </div>
              <div>
                <h2 className="font-medium text-text">{user?.username}</h2>
                <p className="text-sm text-gray-500 dark:text-white ">Type user: {user?.role}</p>
                <p className="text-sm text-gray-500 dark:text-white">Account ID: {user?.id}</p>
              </div>
            </div> */}
        </div>
        <div className="relative mb-4">
          <input type="text" className="input rounded-full " />
          <div className="absolute left-3 top-1/2 -translate-y-1/2"><CiSearch className="w-6 h-6 text-gray-500"/></div>
        </div>
        {chatList?.map((list: any) => (
          <div
            key={list.user_id}
            className=" rounded m-2 flex justify-between items-center hover:bg-surface"
            onClick={() => {
              setTargetUserId(list.user_id);
              setOpenChat(list);
            }}
          >
            <div className="flex gap-2 items-center">
              <div className="">
                <img
                  src={`${Api.defaults.baseURL}/images/users/${list.picture}`}
                  alt={list.picture}
                  className="w-12 h-12 object-cover rounded-full"
                />
              </div>
              <div>
                <div className="font-semibold text-text">{list.name}</div>
                <div className="text-sm text-gray-500">{list.message}</div>
              </div>
            </div>
            <div className="text-text text-sm">
              {formatDate(list.created_at)}
            </div>
          </div>
        ))}
      </div>
      <div className="col-span-3 relative min-h-screen">
        {messages.length > 0 ? (
          <div >
            <div className="font-semibold text-text px-3 py-4">
          {openChat?.name}
        </div>
        <hr />

        {/* 📩 messages */}
        <div className="px-4">
          {messages?.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${
                String(msg.from) === String(user?.id)
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  String(msg.from) === String(user?.id)
                    ? "bg-green-100"
                    : "bg-gray-200"
                }`}
              >
                {msg.message}
              </span>
            </div>
          ))}
        </div>

        {/* ✏️ input message */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3">
          <div className="max-w-7xl mx-auto flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full space-y-4">
            <img src={banner_hero} alt="hero" />
            <span className="text-3xl font-semibold text-text">Welcome to SubGame Chat</span>
            <span className="text-lg text-gray-500">Start conversation now</span>
            <div className="py-4 px-16 bg-surface flex flex-col text-center">
              <span className="mb-2 text-gray-500">Please report to us if you find a seller asking you to</span>
              <span className="text-text">- Making transactions outside of the SubGame</span>
              <span className="text-text">- Exchange a product for another item</span>
              <span className="mt-2 text-gray-500">Beware of potential scam and happy shopping</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTest;
