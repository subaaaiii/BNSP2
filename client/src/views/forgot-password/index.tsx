import { useState } from "react";
import { useNavigate } from "react-router";
import { useSendResetPasswordEmail } from "../../hooks/forgot_password/useSendResetPasswordEmail";
import { toast } from "react-hot-toast/headless";

interface ValidationErrors {
  [key: string]: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const {mutate, isPending} = useSendResetPasswordEmail();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      email,
      {
        onSuccess: () => {
          toast.success("Email reset password berhasil dikirim!");
          navigate("/login");
        },
        onError: (error: any) => {
          setErrors({ Email: error.message });
        }
      }
    );

  };

  return (
    <div className="flex justify-center items-center ">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset border-base-300 rounded-box w-lg  p-4">
          <div className="flex justify-center items-center">
            <legend className="fieldset-legend text-lg font-semi-bold">
              Reset your password
            </legend>
          </div>
          <div className="flex text-sm text-gray-500 justify-center">
            Enter your email to receive reset password instructions
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

          <input
            type="email"
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

          <button type="submit" className="btn btn-neutral mt-4">
            {isPending ? "Loading..." : "Send email"}
          </button>
          <div className="flex justify-center gap-2 ">
            {" "}
            <span>Don't have account?</span>
            <a
              href="/register"
              className="text-sm text-blue-500 hover:underline"
            >
              Register
            </a>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ForgotPassword;
