import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import { IoMdClose } from "react-icons/io";
import { IoBookmarksOutline } from "react-icons/io5";
import { HiSquare2Stack } from "react-icons/hi2";
import { CiMail } from "react-icons/ci";
import { FaChevronDown, FaDollarSign } from "react-icons/fa";

const NavbarPage: React.FC = () => {
  const [model, setModel] = useState<boolean>(false);
  const [languageDropdown, setLanguageDropdown] = useState<boolean>(false);
  const [currencyDropdown, setCurrencyDropdown] = useState<boolean>(false);

  const handleOpenModel = () => setModel(true);
  const handleCloseModel = () => setModel(false);

  const handleNavClick = (item: string): void => {
    console.log(`${item} clicked`);
  };

  return (
    <>
      {/* Login Modal */}
      {model && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
              <IoMdClose
                onClick={handleCloseModel}
                className="cursor-pointer text-gray-500 hover:text-gray-700 text-xl transition-colors"
              />
            </div>
            <LoginForm onClose={handleCloseModel} />
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="bg-yellow-400 h-12">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left Side */}
            <div className="flex items-center space-x-6">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                  className="flex items-center space-x-1 text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium uppercase tracking-wide"
                >
                  <span>ENGLISH</span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      languageDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {languageDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-32 bg-white rounded shadow-lg border z-30">
                    <div className="py-1">
                      <button className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        ENGLISH
                      </button>
                      <button className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        ESPAÑOL
                      </button>
                      <button className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        FRANÇAIS
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyDropdown(!currencyDropdown)}
                  className="flex items-center space-x-1 text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium uppercase tracking-wide"
                >
                  <FaDollarSign className="text-xs" />
                  <span>DOLLAR (US)</span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      currencyDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {currencyDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded shadow-lg border z-30">
                    <div className="py-1">
                      <button className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        $ DOLLAR (US)
                      </button>
                      <button className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        € EURO
                      </button>
                      <button className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        £ POUND
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-800 text-sm font-medium uppercase tracking-wide">
                WELCOME TO OUR STORE!
              </span>

              <Link
                to="/Blogs"
                onClick={() => handleNavClick("Blog")}
                className="flex items-center space-x-1 text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium uppercase tracking-wide"
              >
                <IoBookmarksOutline className="text-sm" />
                <span>BLOG</span>
              </Link>

              <Link
                to="/FAQ"
                onClick={() => handleNavClick("FAQ")}
                className="flex items-center space-x-1 text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium uppercase tracking-wide"
              >
                <HiSquare2Stack className="text-sm" />
                <span>FAQ</span>
              </Link>

              <Link
                to="/Contact"
                onClick={() => handleNavClick("Contact")}
                className="flex items-center space-x-1 text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium uppercase tracking-wide"
              >
                <CiMail className="text-sm" />
                <span>CONTACT US</span>
              </Link>

              <button
                onClick={handleOpenModel}
                className="text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium uppercase tracking-wide"
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarPage;
