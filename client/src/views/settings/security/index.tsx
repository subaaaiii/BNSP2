import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useVerifyChangeEmailOTP } from "../../../hooks/change_email/verify_email";
import { useSendChangeEmailOTP } from "../../../hooks/change_email/send_email";
import { useChangePassword } from "../../../hooks/change_password/useChangePassword";
import { useNavigate } from "react-router";

interface ValidationErrors {
  [key: string]: string;
}

const Security = () => {
  const { user, setUser } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [step, setStep] = useState<"send" | "verify">("send");
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const sendOtpMutation = useSendChangeEmailOTP();
  const verifyOtpMutation = useVerifyChangeEmailOTP();
  // const changePasswordMutation = useChangePassword();
  const { mutate: changePasswordMutation, isPending: isChangingPassword } =
    useChangePassword();

  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
  };

  const loading = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  const openModal = () => {
    setStep("send");
    setOtp("");
    setNewEmail("");

    const modal = document.getElementById(
      "change_email_modal",
    ) as HTMLDialogElement | null;

    modal?.showModal();
  };

  const sendOTP = () => {
    sendOtpMutation.mutate(undefined, {
      onSuccess: () => {
        setStep("verify");
      },
    });
  };

  const verifyOTP = () => {
    verifyOtpMutation.mutate(
      {
        otp,
        newEmail,
      },
      {
        onSuccess: () => {
          // update AuthContext
          setUser((prev: any) => ({
            ...prev,
            email: newEmail,
          }));
          alert("Email berhasil diubah");

          setOtp("");
          setNewEmail("");

          const modal = document.getElementById(
            "change_email_modal",
          ) as HTMLDialogElement | null;

          modal?.close();
        },
      },
    );
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let validationErrors: ValidationErrors = {};

    const rules = validatePassword(newPassword);

    if (!Object.values(rules).every(Boolean)) {
      validationErrors.newPassword = "Password belum memenuhi semua kriteria";
    }

    if (password === newPassword) {
      validationErrors.newPassword =
        "Password baru tidak boleh sama dengan password lama";
    }
    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Konfirmasi password tidak sama";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    changePasswordMutation(
      {
        password,
        newPassword,
      },
      {
        onSuccess: () => {
          navigate("/login");
        },
        onError: (error: any) => {
          setErrors(error.response.data.errors);
        },
      },
    );
  };

  return (
    <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
      <div className="flex flex-row">
        <div className="flex flex-col mb-5 items-start w-full ">
          <h2 className="mb-5 text-4xl font-bold text-blue-900">Security</h2>

          {/* EMAIL */}
          <div className="flex justify-between w-full items-center py-4">
            <div>
              <div className="font-semibold text-lg">Email</div>
              <div className="text-gray-600">
                Your Email Address is {user?.email}
              </div>
            </div>

            <button
              className="shadow-md py-3 px-5 rounded-box cursor-pointer"
              onClick={openModal}
            >
              Edit
            </button>
          </div>

          <hr className="w-full border-gray-300" />

          {/* PASSWORD */}
          <div className="flex justify-between w-full items-center py-4">
            <div>
              <div className="font-semibold text-lg">Password</div>
              <div className="text-gray-600">
                Guard your password and do not reveal it to anyone.
              </div>
            </div>

            <button
              className="shadow-md py-3 px-5 rounded-box cursor-pointer"
              onClick={() => {
                const modal = document.getElementById(
                  "change_password_modal",
                ) as HTMLDialogElement | null;
                modal?.showModal();
              }}
            >
              Edit
            </button>
          </div>

          <hr className="w-full border-gray-300" />
        </div>
      </div>

      {/* CHANGE EMAIL MODAL */}
      <dialog id="change_email_modal" className="modal">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg mb-4">Change Email</h3>

          {/* STEP 1 */}
          {step === "send" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Kami akan mengirim OTP ke email Anda untuk verifikasi.
              </p>

              <button
                onClick={sendOTP}
                className="btn btn-neutral w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === "verify" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Masukkan OTP yang dikirim ke email.
              </p>

              <input
                type="text"
                placeholder="OTP Code"
                className="input input-bordered w-full"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <input
                type="email"
                placeholder="New Email"
                className="input input-bordered w-full"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />

              <button
                onClick={verifyOTP}
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Change Email"}
              </button>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* PASSWORD MODAL */}
      <dialog id="change_password_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Change Password</h3>

          <form className="flex flex-col gap-4" onSubmit={handlePasswordChange}>
            {/* Current Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <div className="relative">
                <input
                  placeholder="Enter current password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input input-bordered w-full pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2  text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  placeholder="Enter new password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className={` input input-bordered w-full ${
                    errors.newPassword ? "input-error" : ""
                  }`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewPassword(value);
                    setPasswordRules(validatePassword(value));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2  text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              {isPasswordFocused ? (
                <div className="text-sm space-y-1">
                  {!passwordRules.minLength ? (
                    <p className="text-gray-400">• Minimal 8 karakter</p>
                  ) : (
                    ""
                  )}
                  {!passwordRules.hasUpper ? (
                    <p className="text-gray-400">• Mengandung huruf besar</p>
                  ) : (
                    ""
                  )}
                  {!passwordRules.hasLower ? (
                    <p className="text-gray-400">• Mengandung huruf kecil</p>
                  ) : (
                    ""
                  )}
                  {!passwordRules.hasNumber ? (
                    <p className="text-gray-400">• Mengandung angka</p>
                  ) : (
                    ""
                  )}
                  {!passwordRules.hasSymbol ? (
                    <p className="text-gray-400">• Mengandung simbol</p>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              {errors.newPassword && (
                <div className="text-error text-sm">
                  <span>{errors.newPassword}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <div className="relative">
                <input
                  placeholder="Confirm new password"
                  type={showNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input input-bordered w-full ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2  text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="text-error text-sm">
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button className="btn" type="button">
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>

        {/* click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Security;
