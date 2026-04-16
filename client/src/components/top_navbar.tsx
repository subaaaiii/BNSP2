import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from "react-router";

const TopNavbar = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex md:hidden justify-between items-center bg-white md:bg-transparent fixed md:static top-0 left-0 w-full p-5 shadow-lg md:shadow-none">
      <div className="flex items-center gap-5">
        <FaAngleLeft className="w-8 h-7" onClick={() => navigate(-1)} />
        <h1 className="text-xl font-medium text-gray-900">{title}</h1>
      </div>
    </div>
  );
};
export default TopNavbar;
