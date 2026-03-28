import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSendOTP } from "../../hooks/auth/useSendOTP";
import { useVerifyEmail } from "../../hooks/auth/useVerifyEmail";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ambil email dari query (?email=...)
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const { mutate: verifyOtp, isPending } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResending } = useSendOTP();

  const handleVerify = () => {
    if (!otp) {
      setError("Kode OTP wajib diisi");
      return;
    }

    verifyOtp(
      { email, otp },
      {
        onSuccess: () => {
          navigate("/login");
        },
        onError: () => {
          setError("Kode OTP salah atau sudah expired");
        },
      },
    );
  };

  const handleResend = () => {
    resendOtp(email, {
      onSuccess: () => {
        alert("OTP berhasil dikirim ulang");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Verifikasi Email
        </h2>
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
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        {/* Verify Button */}
        <button onClick={handleVerify} className="btn btn-primary w-full mt-4">
          {isPending ? "Memverifikasi..." : "Verifikasi"}
        </button>

        {/* Resend */}
        <div className="text-center mt-4 text-sm">
          Tidak menerima kode?{" "}
          <button
            onClick={handleResend}
            className="text-indigo-600 font-medium hover:underline"
            disabled={isResending}
          >
            {isResending ? "Mengirim..." : "Kirim ulang"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
