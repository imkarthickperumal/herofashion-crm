import { Menu, User } from "lucide-react";
import Logo from "../assets/logo.png";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/api";
import toast from "react-hot-toast";
import GlobalSearch from "./GlobalSearch";

const Navbar = ({
  toggleSidebar,
  globalFilter,
  setGlobalFilter,
  onExportExcel,
  onExportPDF,
  user, // ✅ Add this
  setUser,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const serverRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        serverRef.current &&
        !serverRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
        setIsServerMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.classList[isDarkMode ? "add" : "remove"]("dark");
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900 shadow-sm">
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-4 gap-3">
        {/* Left */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-1/3">
          <HeaderLeftSection
            toggleSidebar={toggleSidebar}
            isProfileMenuOpen={isProfileMenuOpen}
            setIsProfileMenuOpen={setIsProfileMenuOpen}
            handleLogout={handleLogout}
            profileRef={profileRef}
          />
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <GlobalSearch
              searchTerm={globalFilter}
              setSearchTerm={setGlobalFilter}
              placeholder="Search orders..."
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start mb-4">
            <button
              onClick={onExportExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm flex-1 sm:flex-none"
            >
              Export Excel
            </button>
            <button
              onClick={onExportPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm flex-1 sm:flex-none"
            >
              Export PDF
            </button>
          </div>

          {/* <div className="relative mt-2 sm:mt-0 mb-4" ref={serverRef}>
            <button
              onClick={() => setIsServerMenuOpen(!isServerMenuOpen)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              Servers ▾
            </button>
            {isServerMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden">
                <button className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700">
                  Production 11
                </button>
                <button className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700">
                  Test 13
                </button>
              </div>
            )}
          </div> */}

          {/* <div className="relative mt-2 sm:mt-0 mb-4" ref={serverRef}>
            <button
              onClick={() => setIsServerMenuOpen(!isServerMenuOpen)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              Servers ▾
            </button>
            {isServerMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden z-50">
                <button
                  onClick={() => {
                    navigate("/server11");
                    setIsServerMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                  Production 11
                </button>
                <button
                  onClick={() => {
                    navigate("/server13");
                    setIsServerMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                  Test 13
                </button>
              </div>
            )}
          </div> */}

          {/* Servers Dropdown */}
          {!user?.isDummy && (
            <div className="relative mt-2 sm:mt-0 mb-4" ref={serverRef}>
              <button
                onClick={() => setIsServerMenuOpen(!isServerMenuOpen)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
              >
                Servers ▾
              </button>
              {isServerMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate("/server11");
                      setIsServerMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700"
                  >
                    Production 11
                  </button>
                  <button
                    onClick={() => {
                      navigate("/server13");
                      setIsServerMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700"
                  >
                    Test 13
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="hidden sm:block mb-4">
            <ProfileDropdown
              isProfileMenuOpen={isProfileMenuOpen}
              setIsProfileMenuOpen={setIsProfileMenuOpen}
              handleLogout={handleLogout}
              profileRef={profileRef}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export const HeaderLeftSection = ({
  toggleSidebar,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  handleLogout,
  profileRef,
}) => (
  <div className="flex items-center justify-between gap-3 w-full relative">
    <div className="flex items-center gap-3">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-700"
      >
        <Menu className="dark:text-neutral-400" />
      </button>
      <a className="flex items-center gap-2" href="#">
        <img src={Logo} width={32} alt="Logo" />
        <h5 className="text-lg sm:text-xl font-bold dark:text-neutral-300">
          Hero Fashion
        </h5>
      </a>
    </div>

    <div className="sm:hidden relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
      >
        <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden">
          <button className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700">
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
);

const ProfileDropdown = ({
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  handleLogout,
  profileRef,
}) => (
  <div className="relative" ref={profileRef}>
    <button
      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
      className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
    >
      <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>

    {isProfileMenuOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden">
        <button className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-700">
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-neutral-700"
        >
          Logout
        </button>
      </div>
    )}
  </div>
);

export default Navbar;
