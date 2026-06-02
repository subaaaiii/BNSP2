import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../hooks/auth/useLogin";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

interface ValidationErrors {
  [key: string]: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const submitLogin = () => {
    mutate(
      { username, password },
      {
        onSuccess: () => {
          toast.success("Successfully logged in");
        },
        onError: (error: any) => {
          setErrors(error.response.data.errors);
        },
      },
    );
  };

  return (
    <div className="flex w-full justify-center items-center mt-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitLogin();
        }}
        className="flex w-full justify-center px-4"
      >
        <fieldset className="fieldset border-base-300 rounded-box flex flex-col w-full max-w-md md:w-lg">
          <div className="flex justify-center items-center">
            <legend className="fieldset-legend text-lg font-semi-bold mb-8 text-text">
              Welcome Back!
            </legend>
          </div>
          {errors.Error && (
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
              <span>Wrong Username or password</span>
            </div>
          )}

          <label className="label text-text">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`input w-full bg-surface text-text ${errors.Username ? "input-error" : ""}`}
            placeholder="Username"
          />
          {errors.Username && (
            <div className="text-error">
              <span>{errors.Username}</span>
            </div>
          )}

          <label className="label mt-4 text-text">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input w-full bg-surface text-text pr-12 ${
                errors.Password ? "input-error" : ""
              }`}
              placeholder="Password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            >
              {showPassword ? (
                <FaRegEyeSlash className="w-6 h-6 cursor-pointer" />
              ) : (
                <FaRegEye className="w-6 h-6 cursor-pointer" />
              )}
            </button>
          </div>

          {errors.Password && (
            <div className="text-error mt-1">
              <span>{errors.Password}</span>
            </div>
          )}
          <Link
            to="/forgot-password"
            className="flex w-full justify-end text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
          <button
            type="submit"
            className="hidden md:block p-3 rounded-md bg-[#C5A16F] mt-4 text-bg"
          >
            {isPending ? "Loading..." : "LOGIN"}
          </button>
          <div className="flex justify-center gap-2 ">
            {" "}
            <span className="text-text">Don't have account?</span>
            <Link
              to="/register"
              className="items-center text-sm text-blue-500 underline"
            >
              Register
            </Link>
          </div>
        </fieldset>
        <div className="fixed bottom-0 left-0 w-full bg-bg border-t border-gray-300 p-4 md:hidden">
          <div className="flex w-full justify-between md:justify-end gap-4 px-4 items-center">
            <button
              className="col-span-1 w-full cursor-pointer md:w-auto font-bold p-4 md:p-3 rounded text-center border border-secondary1 md:border-none text-[#C5A16F] "
              onClick={() => navigate("/")}
            >
              Later
            </button>
            <button
              type="button"
              onClick={submitLogin}
              className="w-full md:w-auto bg-[#C5A16F] text-bg cursor-pointer font-medium p-4 md:p-3 rounded text-center"
            >
              {isPending ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
