import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Api from "../services/api";
import UserProfile from "../views/user/profile";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

const Navbar = () => {
  const { user, loading } = useContext(AuthContext)!;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    if (isHome) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const isTransparent = isHome && !scrolled;

  if (location.pathname === "/chat") return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-bg backdrop-blur-md shadow"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center py-4 px-3 md:px-0 ">
        <Link
          to="/"
          className={`text-xl font-bold ${
            isTransparent ? "text-white" : "text-[#C5A16F]"
          }`}
        >
          SubGAME
        </Link>

        <div className="hidden md:block w-full">
          <ul className="flex justify-between md:justify-end w-full items-center gap-2 px-1 p-4 md:p-0">
            {loading ? null : user ? (
              <div className="flex items-center gap-3">
                <Link
                to="/chat"
                  className={`p-2 rounded-full ${isTransparent ? "border  text-white bg-transparent" : "bg-[#C5A16F] text-bg"}`}
                >
                  <IoChatbubbleEllipsesSharp className="w-5 h-5" />
                </Link>
                <div className="relative">
                  {open && (
                    <div
                      className="fixed inset-0 bg-black/50 z-40"
                      onClick={() => setOpen(false)}
                    />
                  )}
                  <div></div>
                  <div
                    onClick={() => setOpen(!open)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={`${Api.defaults.baseURL}/images/users/${user.picture}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {open && (
                    <div className="absolute right-0 mt-3 z-50 bg-white rounded-xl shadow p-4 min-w-[400px]">
                      <UserProfile onClose={() => setOpen(false)} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex w-full justify-between md:justify-end gap-4 px-4 items-center">
                <Link
                  className={`w-full md:w-auto font-medium p-4 md:p-3 rounded text-center border ${
                    isTransparent
                      ? "border-[#2d3330] dark:border-[#C5A16F] bg-transparent text-[#2d3330] dark:text-[#C5A16F]"
                      : "border-[#C5A16F] text-[#C5A16F]"
                  }`}
                  to="/become-seller"
                >
                  Start selling
                </Link>
                <Link
                  to="/login"
                  className={`w-full md:w-auto font-medium p-4 md:p-3 rounded text-center ${
                    isTransparent
                      ? "bg-[#2d3330] text-[#C5A16F] dark:text-[#2d3330]"
                      : "text-bg bg-[#C5A16F]  "
                  }`}
                >
                  Login/Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
