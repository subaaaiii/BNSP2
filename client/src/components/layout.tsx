import type { ReactNode } from "react";
import { useLocation } from "react-router";
import BottomNavbar from "./bottom_navbar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const location = useLocation();

  const showBottomNav = [
    "/",
    "/chat",
    "/notifications",
    "/user/profile",
  ].includes(location.pathname);

  return (
    <div className={showBottomNav ? "pb-20" : ""}>
      {children}
      {showBottomNav && <BottomNavbar />}
    </div>
  );
};

export default Layout;