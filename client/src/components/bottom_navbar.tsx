import { MdHome } from "react-icons/md";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Api from "../services/api";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const { user, loading } = useContext(AuthContext)!;

  return (
    <div className="block md:hidden fixed w-full bg-bg bottom-0 left-0">
      <ul className="flex justify-evenly w-full items-center gap-2 px-1 p-4 md:p-0">
        {loading ? null : user ? (
          <div className="flex items-center gap-4 w-full justify-evenly">
            <div
              className={`flex flex-col items-center ${
                isActive("/") ? "text-[#C5A16F]" : "text-gray-500"
              }`}
              onClick={() => {
                navigate("/");
              }}
            >
              <MdHome className="w-7 h-7" />
              <span className="text-sm">Home</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                isActive("/chat") ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={()=>navigate("/chat")}
            >
              <IoChatbubbleEllipsesSharp className="w-7 h-7" />
              <span className="text-sm">Chat</span>
            </div>
            
            <div
              tabIndex={0}
              role="button"
              onClick={() => {
                navigate("/user/profile");
              }}
            >
              <div
                className={`flex flex-col items-center ${
                  isActive("/user/profile") ? "text-[#C5A16F]" : "text-gray-500"
                }`}
              >
                <div className="avatar cursor-pointer">
                  <div className="w-8 rounded-full">
                    <img
                      alt="avatar"
                      src={`${Api.defaults.baseURL}/images/users/${user.picture}`}
                    />
                  </div>
                </div>
                <span className="text-sm">Profile</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-between md:justify-end gap-4 px-4 items-center">
            <Link
              className="col-span-1 w-full md:w-auto font-bold p-4 md:p-3 rounded text-center border border-[#C5A16F] dark:border-text md:border-none text-[#C5A16F] dark:text-text "
              to="/become-seller"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="w-full md:w-auto bg-[#C5A16F] hover:bg-gray-700 cursor-pointer text-bg font-medium p-4 md:p-3 rounded text-center"
            >
              Log in
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
};
export default BottomNavbar;
