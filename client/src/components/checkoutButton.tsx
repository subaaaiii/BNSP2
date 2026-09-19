import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
declare global {
  interface Window {
    snap: any;
  }
}

const CheckoutButton = ({ productId, qty }: { productId: any; qty: any }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "SB-Mid-client-xxxxxxxxx";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.async = true;

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Panggil endpoint /api/orders di backend Go
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          qty: qty,
        }),
      });

      const result = await response.json();

      if (result.success && result.data.snap_token) {
        // Panggil fungsi snap.pay dari script Midtrans
        window.snap.pay(result.data.snap_token, {
          onSuccess: function (result: any) {
            console.log("Sukses:", result);
            alert("Pembayaran berhasil!");
            // navigate('/success');
            navigate("/orders");
          },
          onPending: function (result: any) {
            console.log("Pending:", result);
            alert("Menunggu pembayaran!");
            navigate("/orders");
          },
          onError: function (result: any) {
            console.log("Error:", result);
            alert("Pembayaran gagal!");
          },
          onClose: function () {
            console.log("Tutup popup tanpa bayar");
            alert("Anda belum menyelesaikan pembayaran.");
          },
        });
      } else {
        alert("Gagal mengambil token pembayaran: " + result.message);
      }
    } catch (error) {
      console.error("Error checkout:", error);
      alert("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        padding: "10px 20px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Memproses..." : "Bayar Sekarang"}
    </button>
  );
};

export default CheckoutButton;
