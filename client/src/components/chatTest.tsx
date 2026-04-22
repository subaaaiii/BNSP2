import { useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import { useChatList } from "../hooks/chat/useChatList";

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
      }
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

  const {data : chatList} = useChatList();

  useEffect(() => {
   console.log("list", chatList)
  }, [chatList]);

  

  return (
    <div className="grid grid-cols-4">
        <div className="col-span-1">
            {chatList?.map ((list:any)=>(
                <div className="p-4 border rounded m-2" onClick={()=>setTargetUserId(list.id)}>
                    {list.name}
                </div>
            )

            )}
        </div>
      <div className="col-span-3" style={{ padding: 20 }}>
        <h2>Chat Test (User {user?.id})</h2>

        {/* 🔥 input target user */}
        <div style={{ marginBottom: 10 }}>
          <input
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="Target user_id (misal: 13)"
            style={{ padding: 8, width: 200 }}
          />
        </div>

        {/* 📩 messages */}
        <div
          style={{
            border: "1px solid #ccc",
            height: 300,
            overflowY: "auto",
            padding: 10,
            marginBottom: 10,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign:
                  String(msg.from) === String(user?.id) ? "right" : "left",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 10,
                  background:
                    String(msg.from) === String(user?.id) ? "#DCF8C6" : "#eee",
                }}
              >
                {msg.message}
              </span>
            </div>
          ))}
        </div>

        {/* ✏️ input message */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatTest;
