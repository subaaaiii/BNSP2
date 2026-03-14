import { useState } from "react";
import Profile from "./profile";
import Security from "./security";

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
    <div className="grid grid-cols-4 min-h-screen">
      <div className="col-span-1 ">
        <div className="flex">
          <ul className="menu min-h-full w-80 p-4 gap-2">
            <li>
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
            </li>

            <li>
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
            </li>
          </ul>
        </div>
      </div>

      <div className="col-span-3">{renderContent()}</div>
    </div>
  );
};
export default Settings;
