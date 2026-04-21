import { useState } from "react";
import { LiaFacebookF } from "react-icons/lia";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import { BsBrightnessHighFill } from "react-icons/bs";
import { MdNightlight } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {

  const { theme, toggleTheme } = useTheme();
  return (
    <div className="bg-surface px-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between  pt-10 pb-10 ">
        <div className="flex flex-col text-center md:text-start">
          <span className="text-sm text-text ">
            SubGame is a comprehensive online marketplace for all things
            gaming-related. We are dedicated to innovating for the gaming
            community’s benefit.
          </span>
          <div className="flex flex-col md:flex-row  justify-center md:justify-start gap-2 items-center mt-4 md:mt-0">
            <span className="text-text text-center md:text-start">
              © 2026 G2G.com | About Us | Terms of Service | Legal | Privacy |
              Policy | Help Center |
            </span>
            <div
              onClick={toggleTheme}
              className="flex  items-center gap-2 px-3 py-2 rounded-full cursor-pointer 
             bg-gray-200 dark:bg-gray-700 
             text-gray-800 dark:text-gray-200 
             transition-all duration-300"
            >
              {theme === "dark" ? (
                <>
                  <MdNightlight className="w-5 h-5 text-black" />
                  <span className="text-sm">Dark</span>
                </>
              ) : (
                <>
                  <BsBrightnessHighFill className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Light</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-4 md:mt-0">
          <div className="flex gap-2 justify-center md:justify-start">
            <div className="border border-text p-2 rounded-full">
              <IoLogoInstagram className="w-5 h-5 text-text" />
            </div>{" "}
            <div className="border border-text p-2 rounded-full">
              <LiaFacebookF className="w-5 h-5 text-text" />
            </div>
            <div className="border border-text p-2 rounded-full">
              <FaLinkedinIn className="w-5 h-5 text-text" />
            </div>{" "}
            <div className="border border-text p-2 rounded-full">
              <FaXTwitter className="w-5 h-5 text-text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
