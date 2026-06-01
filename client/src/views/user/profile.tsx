import { useContext } from "react";
import Api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router";
import { useLogout } from "../../hooks/auth/useLogout";
import BottomNavbar from "../../components/bottom_navbar";

type Props = {
  onClose?: () => void;
};

const UserProfile = ({ onClose }: Props) => {
  const { user, loading } = useContext(AuthContext)!;
  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";
  const isCustomer = user?.role === "customer";
  const { mutate } = useLogout();

  const logout = () => {
  mutate();
};
  return (
    <div className="w-full -mt-20 md:mt-0">
      {loading ? null : user ? (
        <div className="">
          <div className="px-6 py-3 flex w-full justify-between items-center ">
            <div className="flex flex-row items-center gap-3 space-y-2">
              <div className="avatar cursor-pointer">
                <div className="w-9 rounded-full">
                  <img
                    alt="avatar"
                    src={`${Api.defaults.baseURL}/images/users/${user.picture}`}
                  />
                </div>
              </div>
              <div>
                <h2 className="font-medium text-text">{user.username}</h2>
                <p className="text-sm text-gray-500 dark:text-white ">
                  Type user: {user.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-white">
                  Account ID: {user.id}
                </p>
              </div>
            </div>
            <button className=" block md:hidden py-2 px-5 bg-neutral text-white rounded-md cursor-pointer">
              Sell
            </button>
          </div>
          <hr className="border border-gray-300 w-full" />
          <ul
            tabIndex={0}
            className="dropdown-content menu  rounded-box mt-3 z-[1] w-40 w-full p-0 m-0"
            onClick={onClose}
          >
            <li className="w-full px-1 py-2 text-text">
              <Link to="/settings">Settings</Link>
            </li>

            {isAdmin && (
              <>
                <li className="w-full px-1 py-2 text-text">
                  <Link to="/admin/games"> Manage Games</Link>
                </li>
                <li className="w-full px-1 py-2 text-text">
                  <Link to="/admin/review-sellers"> Review Sellers</Link>
                </li>
              </>
            )}

            {isSeller && (
              <>
                <li className="w-full px-1 py-2 text-text">
                  <Link to="/offers/create">Create offers</Link>
                </li>
                <li className="w-full px-1 py-2 text-text">
                  <Link to="/offers">Manage offers</Link>
                </li>
                <li className="w-full px-1 py-2 text-text">
                  <Link to="/orders/sold">Sold orders</Link>
                </li>
              </>
            )}
            <li className="w-full px-1 py-2 text-text">
              <Link to="/orders/purchase">purchase orders</Link>
            </li>
            {isCustomer && (
              <li className="w-full px-1 py-2 text-text">
                <Link to="/become-seller">Start selling</Link>
              </li>
            )}

            <li className="w-full px-1 py-2 text-text">
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="p-6">
          <p>User not found</p>
        </div>
      )}
      <BottomNavbar />
    </div>
  );
};
export default UserProfile;
