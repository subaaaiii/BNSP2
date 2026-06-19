import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { useCreateUser } from "../../hooks/auth/useCreateUser";
import { useResendOTP } from "../../hooks/auth/useResendOtp";

const VerifyUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const { mutate, isPending } = useCreateUser();
  const { mutate: resendOtp, isPending: isResendOtp } = useResendOTP();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!otp) {
      setError("Kode OTP wajib diisi");
      return;
    }

    mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("Verification success");
          navigate("/login");
        },
        onError: (error:any) => {
          setError(error.response?.data?.message || "Wrong or expired OTP");
        },
      },
    );
  };

  // resend OTP
  const handleResend = () => {
    resendOtp(
      { email },
      {
        onSuccess: (res) => {
          toast.success(res.message || "OTP resent succesfully");
        },
        onError: (error:any) => {
          toast.error(error.response?.data?.message || "Failed to resend OTP");
          console.log("error",error)
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Verify email</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the OTP code sent to <br />
          <span className="font-semibold">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Masukkan 6 digit kode"
          className="input input-bordered w-full text-center text-lg tracking-widest"
          maxLength={6}
        />

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <button onClick={handleVerify} className="btn btn-primary w-full mt-4">
          {isPending ? "Verifyng..." : "Verify"}
        </button>

        {/* Resend */}
        <div className="text-center mt-4 text-sm">
          Not receive OTP code?{" "}
          <button
            onClick={handleResend}
            className="text-indigo-600 font-medium hover:underline"
            disabled={isResendOtp}
          >
            {isResendOtp ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-400 text-center mt-2">
          OTP valid for 10 minutes
        </p>
      </div>
    </div>
  );
};

export default VerifyUser;
