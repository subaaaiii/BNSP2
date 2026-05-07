import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Api from "../services/api";
import UserProfile from "../views/user/profile";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import logo from "../../public/logo.png"

const Navbar = () => {
  const { user, loading } = useContext(AuthContext)!;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    if (isHome) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const isTransparent = isHome && !scrolled;

  const hiddenRoutes = ["/chat", "/user/profile"];

  if (hiddenRoutes.some((route) => location.pathname.startsWith(route))) {
    return null;
  }

  return (
    <>
      {open && (
        <label
          className="drawer-overlay fixed inset-0 bg-black/50 z-[90]"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-transparent"
            : "bg-bg shadow"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center py-4 px-3 md:px-0 ">
          <Link
            to="/"
            className={`text-xl font-bold flex items-center gap-1 ${
              isTransparent ? "text-[#2d3330]" : "text-[#C5A16F]"
            }`}
          >
            <img src={logo} alt="" className="w-7 h-7"/>
            SubGAME
          </Link>

          <div className="hidden md:block w-full">
            <ul className="flex justify-between md:justify-end w-full items-center gap-2 px-1 p-4 md:p-0">
              {loading ? null : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/chat"
                    className={`p-2 rounded-full ${
                      isTransparent
                        ? "border border-[#2d3330] text-[#2d3330] bg-transparent"
                        : "border border-secondary1 bg-bg text-secondary1"
                    }`}
                  >
                    <IoChatbubbleEllipsesSharp className="w-5 h-5" /> 
                  </Link>

                  <div className="relative z-[70]">
                    <div
                      onClick={() => setOpen(!open)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img
                              src={`${Api.defaults.baseURL}/images/users/${user.picture}`}
                              alt="profile"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {open && (
                      <div className="absolute right-0 mt-3 z-[200] bg-bg rounded-xl shadow-xl p-4 min-w-[400px]">
                        <UserProfile onClose={() => setOpen(false)} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex w-full justify-between md:justify-end gap-4 px-4 items-center">
                  <Link
                    className={`w-full md:w-auto font-medium p-4 md:py-3 md:px-6 rounded-full text-center border ${
                      isTransparent
                        ? "border-[#2d3330] dark:border-[#C5A16F] bg-transparent text-[#2d3330] dark:text-[#C5A16F]"
                        : "border-[#C5A16F] text-[#C5A16F]"
                    }`}
                    to="/register"
                  >
                    Sign up
                  </Link>

                  <Link
                    to="/login"
                    className={`w-full md:w-auto font-medium p-4 md:py-3 md:px-6 rounded-full text-center ${
                      isTransparent
                        ? "bg-[#2d3330] text-[#C5A16F] dark:text-[#2d3330]"
                        : "text-bg bg-[#C5A16F]"
                    }`}
                  >
                    Log in
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;