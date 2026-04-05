import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useSendOTP } from "../../hooks/auth/useSendOTP";
import { useVerifyEmail } from "../../hooks/auth/useVerifyEmail";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const message = location.state?.message;
  const hasShown = useRef(false);

  useEffect(() => {
    if (message && !hasShown.current) {
      toast.error(message);
      hasShown.current = true;
    }
  }, [message]);

  const { user } = useContext(AuthContext) || {};

  // ambil email dari query (?email=...)
  const email = searchParams.get("email") || user?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const { mutate: verifyOtp, isPending } = useVerifyEmail();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOTP();

  // 🔥 kirim OTP pertama kali (manual)
  const handleSendOtp = () => {
    if (!email) {
      toast.error("Email tidak ditemukan");
      return;
    }

    sendOtp(email, {
      onSuccess: () => {
        toast.success("OTP berhasil dikirim ke " + email);
        setOtpSent(true);
      },
      onError: () => {
        toast.error("Gagal mengirim OTP");
      },
    });
  };

  // 🔥 verify OTP
  const handleVerify = () => {
    if (!otp) {
      setError("Kode OTP wajib diisi");
      return;
    }

    verifyOtp(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("Verifikasi berhasil");
          navigate("/login");
        },
        onError: () => {
          setError("Kode OTP salah atau sudah expired");
        },
      }
    );
  };

  // 🔥 resend OTP
  const handleResend = () => {
    sendOtp(email, {
      onSuccess: () => {
        toast.success("OTP berhasil dikirim ulang");
      },
      onError: () => {
        toast.error("Gagal mengirim OTP");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          {otpSent ? "Verifikasi Email" : "Kirim OTP"}
        </h2>

        {/* STEP 1: Kirim OTP */}
        {!otpSent && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Klik tombol di bawah untuk mengirim kode OTP ke email kamu
            </p>

            <p className="font-semibold mb-4">{email}</p>

            <button
              onClick={handleSendOtp}
              className="btn btn-primary w-full"
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Mengirim..." : "Kirim OTP"}
            </button>
          </div>
        )}

        {/* STEP 2: Verifikasi OTP */}
        {otpSent && (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">
              Masukkan kode OTP yang dikirim ke <br />
              <span className="font-semibold">{email}</span>
            </p>

            {/* Input OTP */}
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Masukkan 6 digit kode"
              className="input input-bordered w-full text-center text-lg tracking-widest"
              maxLength={6}
            />

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {error}
              </p>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              className="btn btn-primary w-full mt-4"
            >
              {isPending ? "Memverifikasi..." : "Verifikasi"}
            </button>

            {/* Resend */}
            <div className="text-center mt-4 text-sm">
              Tidak menerima kode?{" "}
              <button
                onClick={handleResend}
                className="text-indigo-600 font-medium hover:underline"
                disabled={isSendingOtp}
              >
                {isSendingOtp ? "Mengirim..." : "Kirim ulang"}
              </button>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-400 text-center mt-2">
              Kode berlaku selama 5 menit
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;