import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/auth/useLogin";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";

interface ValidationErrors {
  [key: string]: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const { setIsAuthenticated, setUser } = useContext(AuthContext)!;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      {
        username,
        password,
      },
      {
        onSuccess: (data: any) => {
          Cookies.set("token", data.data.token);
          const userData = {
            id: data.data.id,
            name: data.data.name,
            username: data.data.username,
            email: data.data.email,
            role: data.data.role,
            picture: data.data.picture,
          };
          setUser(userData);
          setIsAuthenticated(true);
          navigate("/");
        },
        onError: (error: any) => {
          setErrors(error.response.data.errors);
          console.log("errornya nih",errors)
        },
      },
    );
  };
  return (
    <div className="flex justify-center items-center ">
      <form onSubmit={handleLogin}>
        <fieldset className="fieldset border-base-300 rounded-box w-lg  p-4">
          <div className="flex justify-center items-center">
            <legend className="fieldset-legend text-lg font-semi-bold">
              Login
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
              <span>Wrong Username or password </span>
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

          <label className="label">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input w-full pr-12 ${
                errors.Password ? "input-error" : ""
              }`}
              placeholder="Password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.Password && (
            <div className="text-error mt-1">
              <span>{errors.Password}</span>
            </div>
          )}
          <button type="submit" className="btn btn-neutral mt-4">
            {isPending ? "Loading..." : "LOGIN"}
          </button>
          <div className="flex justify-center gap-2 "> <span>Don't have account?</span>
          <a href="/register">register</a></div>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
