import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Api from "../services/api";
import UserProfile from "../views/user/profile";

const Navbar = () => {
  const { user, loading } = useContext(AuthContext)!;
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-base-100 border-b border-base-300 ">
      <div className="navbar max-w-7xl mx-auto">
        <div className="flex w-full justify-center md:justify-start md:navbar-start">
          <Link to="/" className="text-xl font-bold">
            SubGAME
          </Link>
        </div>

        
        <div className="hidden md:block w-full">
          <ul className="flex justify-between md:justify-end w-full md:menu md:menu-horizontal items-center gap-2 px-1 p-4 md:p-0">
            {loading ? null : user ? (
              <div className="relative">
                {/* OVERLAY */}
                {open && (
                  <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                  />
                )}

                {/* TRIGGER */}
                <div onClick={() => setOpen(!open)} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span>{user.username}</span>
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={`${Api.defaults.baseURL}/images/users/${user.picture}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 mt-3 z-50 bg-white rounded-xl shadow p-4 min-w-[400px]">
                    <UserProfile onClose={() => setOpen(false)} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex w-full justify-between md:justify-end gap-4 px-4 items-center">
                <Link
                  className="col-span-1 w-full md:w-auto font-bold p-4 md:p-3 rounded text-center border border-neutral md:border-none text-neutral "
                  to="/become-seller"
                >
                  Start selling
                </Link>
                <Link
                  to="/login"
                  className="w-full md:w-auto bg-neutral hover:bg-gray-700 cursor-pointer text-white font-medium p-4 md:p-3 rounded text-center"
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
