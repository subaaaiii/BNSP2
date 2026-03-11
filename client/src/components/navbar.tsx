import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, loading } = useContext(AuthContext)!;

  return (
    <div className="navbar bg-base-100 border-b border-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>

        <Link to="/" className="text-xl font-bold">
          SubFOOD
        </Link>
      </div>

      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal items-center gap-2 px-1">
          <li>
            <a>Keranjang</a>
          </li>

          <li>
            <details>
              <summary>Buka toko</summary>
              <ul className="p-2 bg-base-100 w-40 z-1">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            {loading ? null : user ? (
              <div className="flex dropdown dropdown-end ">
                <div tabIndex={0} role="button">
                  <div className="flex items-center gap-2">
                    <span>{user.username}</span>

                  <div className="avatar cursor-pointer">
                    <div className="w-8 rounded-full">
                      <img
                        alt="avatar"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  </div>
                  <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box mt-3 z-[1] w-40 p-2 shadow"
                >
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>

                  <li>
                    <Link to="/orders">Pesanan</Link>
                  </li>

                  <li>
                    <button>Logout</button>
                  </li>
                </ul>
                </div>

                
              </div>
            ) : (
              <Link to="/login" className="btn btn-neutral btn-sm">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
