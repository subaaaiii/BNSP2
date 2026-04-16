import { useState } from "react";
import Profile from "./profile";
import Security from "./security";
import { useNavigate } from "react-router";
import TopNavbar from "../../components/top_navbar";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "security":
        return <Security />;
    }
  };
  return (
    <div className="grid grid-cols-4 md:min-h-screen">
      <div className="col-span-4 md:col-span-1">
        <div className="flex p-4">
          <ul className="flex flex-row md:flex-col min-h-full shadow-xl md:shadow-none p-4 md:p-0 rounded-box w-full border border-gray-300 md:border-none">
            <button
              className={`w-full text-lg text-left px-5 py-3 rounded-box ${
                activeTab === "profile"
                  ? "bg-base-100 font-semibold shadow-md"
                  : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>

            <button
              className={`w-full text-lg text-left px-5 py-3 rounded-box ${
                activeTab === "security"
                  ? "bg-base-100 font-semibold shadow-md"
                  : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
          </ul>
        </div>
      </div>

      <div className="col-span-4 md:col-span-3">
        <TopNavbar title="Settings" />
        {renderContent()}
      </div>
    </div>
  );
};
export default Settings;
