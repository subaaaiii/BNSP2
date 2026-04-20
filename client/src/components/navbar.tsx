import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Api from "../services/api";
import UserProfile from "../views/user/profile";

const Navbar = () => {
  const { user, loading } = useContext(AuthContext)!;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleDark = () => {
  document.documentElement.classList.toggle("dark");
};

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

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-bg backdrop-blur-md shadow border-b border-base-300"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center py-4 ">
        <div className="flex w-full justify-between md:justify-start md:navbar-start">
          <Link
            to="/"
            className={`text-xl font-bold ${
              isTransparent ? "text-white" : "text-primary1"
            }`}
          >
            SubGAME
          </Link>
        </div>
        <button onClick={toggleDark}>Toggle Dark</button>

        <div className="hidden md:block w-full">
          <ul className="flex justify-between md:justify-end w-full items-center gap-2 px-1 p-4 md:p-0">
            {loading ? null : user ? (
              <div className="relative">
                {open && (
                  <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                  />
                )}

                <div
                  onClick={() => setOpen(!open)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={isTransparent ? "text-white" : "text-primary1"}
                    >
                      {user.username}
                    </span>
                    <div className="avatar">
                      <div className="w-10 rounded-full">
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
            ) : (
              <div className="flex w-full justify-between md:justify-end gap-4 px-4 items-center">
                <Link
                  className={`col-span-1 w-full md:w-auto font-bold p-4 md:p-3 rounded text-center border ${
                    isTransparent
                      ? "border-white text-white"
                      : "border-primary1 text-primary1"
                  }`}
                  to="/become-seller"
                >
                  Start selling
                </Link>
                <Link
                  to="/login"
                  className={`w-full md:w-auto font-medium p-4 md:p-3 rounded text-center ${
                    isTransparent
                      ? "bg-bg text-text"
                      : "bg-primary1 text-surface hover:bg-primary1-hover"
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