import { useState } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router";
import { useResetPassword } from "../../hooks/forgot_password/useResetPassword";
import toast from "react-hot-toast";

interface ValidationErrors {
  [key: string]: string;
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
  };

  const token = searchParams.get("token");
  if (!token) {
    return <Navigate to="/restricted" replace />;
  }

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const { mutate, isPending } = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: ValidationErrors = {};

    if (!token) {
      return <div>Link tidak valid atau expired</div>;
    }

    const rules = validatePassword(form.password);

    if (!Object.values(rules).every(Boolean)) {
      validationErrors.Password = "Password belum memenuhi semua kriteria";
    }

    if (form.password !== form.confirmPassword) {
      validationErrors.ConfirmPassword = "Password tidak sama";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    mutate(
      { token, password: form.password },
      {
        onSuccess: () => {
          toast.success("Password berhasil direset, silahkan login kembali!");
          navigate("/login");
        },
        onError: (error: any) => {
          const res = error.response?.data;

          if (res.errors) {
            // validation error
            setErrors(res.errors);
          } else {
            // general error
            setErrors({ general: res.message });
          }
        },
      },
    );
  };

  return (
    <div className="flex justify-center mt-16 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        {errors.general && (
          <p className="text-red-500 mb-3">{errors.general}</p>
        )}

        <label className="label">Password</label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            value={form.password}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({ ...prev, password: value }));
              setPasswordRules(validatePassword(value));
            }}
            className={`input w-full pr-12 ${
              errors.Password ? "input-error" : ""
            }`}
            placeholder="Password"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 cursor-pointer  -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
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

        {errors.Password && (
          <div className="text-error mt-1">
            <span>{errors.Password}</span>
          </div>
        )}
        <label className="label mt-4">Konfirmasi Password</label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            className="input w-full pr-12"
            placeholder="Konfirmasi Password"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-neutral text-white py-2 rounded mt-4 cursor-pointer hover:bg-neutral-600 disabled:bg-gray-400"
        >
          {isPending ? "Loading..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
