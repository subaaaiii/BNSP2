import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegister } from "../../hooks/auth/useRegister";

interface ValidationErrors {
  [key: string]: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let validationErrors: ValidationErrors = {};

    const rules = validatePassword(password);

    if (!Object.values(rules).every(Boolean)) {
      validationErrors.Password = "Password belum memenuhi semua kriteria";
    }

    if (password !== password2) {
      validationErrors.Password2 = "Konfirmasi password tidak sama";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    mutate(
      {
        name,
        username,
        email,
        password,
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
    <div className="flex justify-center items-center ">
      <form onSubmit={handleRegister}>
        <fieldset className="fieldset border-base-300 rounded-box w-lg  p-4">
          <div className="flex justify-center items-center">
            <legend className="fieldset-legend text-lg font-semi-bold">
              Register
            </legend>
          </div>
          {errors?.Error && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Wrong Username or password </span>
            </div>
          )}

          <label className="label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input w-full ${errors.Name ? "input-error" : ""}`}
            placeholder="Name"
          />
          {errors.Name && (
            <div className="text-error">
              <span>{errors.Name}</span>
            </div>
          )}

          <label className="label">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`input w-full ${errors.Username ? "input-error" : ""}`}
            placeholder="Username"
          />
          {errors.Username && (
            <div className="text-error">
              <span>{errors.Username}</span>
            </div>
          )}
          <label className="label">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input w-full ${errors.Email ? "input-error" : ""}`}
            placeholder="Email"
          />
          {errors.Email && (
            <div className="text-error">
              <span>{errors.Email}</span>
            </div>
          )}

          <label className="label">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {isPasswordFocused? (
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
          ): ""}

          {errors.Password && (
            <div className="text-error mt-1">
              <span>{errors.Password}</span>
            </div>
          )}
          <label className="label">Konfirmasi Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className={`input w-full pr-12 ${
                errors.Password2 ? "input-error" : ""
              }`}
              placeholder="Konfirmasi Password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.Password2 && (
            <div className="text-error mt-1">
              <span>{errors.Password2}</span>
            </div>
          )}
          <button type="submit" className="btn btn-neutral mt-4">
            {isPending ? "Loading..." : "REGISTER"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
