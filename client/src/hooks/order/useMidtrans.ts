import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Api from "../../services/api";

declare global {
  interface Window {
    snap: any;
  }
}

export const useMidtrans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.async = true;

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const checkout = async (productId: any, qty: any) => {
    setIsLoading(true);

    try {
      const response = await Api.post(`/api/orders`, {
        product_id: productId,
        qty: qty,
      });
      const result = await response.data;

      if (result.success && result.data.snap_token) {
        window.snap.pay(result.data.snap_token, {
          onSuccess: function (result: any) {
            console.log("Sukses:", result);
            alert("Pembayaran berhasil!");
            navigate("/orders/purchase");
          },
          onPending: function (result: any) {
            console.log("Pending:", result);
            alert("Menunggu pembayaran!");
            navigate("/orders/purchase");
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
      setIsLoading(false);
    }
  };

  return { checkout, isLoading };
};
