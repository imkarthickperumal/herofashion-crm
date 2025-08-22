// Navbar.jsx
import { Menu, User } from "lucide-react";
import Logo from "../assets/logo.png";
import { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/api";
import toast from "react-hot-toast";

const Navbar = ({
  toggleSidebar,
  globalFilter,
  setGlobalFilter,
  onExportExcel,
  onExportPDF,
  setUser,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const pageTitles = {
    "/": "Home Orders",
    "/overall": "Overall Orders",
    "/empwise": "EMPWise Orders",
    "/tx_order": "TX Orders",
    "/chennai": "Chennai",
    "/server11": "Server 11",
  };

  const currentTitle = pageTitles[location.pathname] || "Orders";

  // ✅ handle logout
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

  // ✅ Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
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
        {/* Left side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-1/3">
          <HeaderLeftSection
            toggleSidebar={toggleSidebar}
            isProfileMenuOpen={isProfileMenuOpen}
            setIsProfileMenuOpen={setIsProfileMenuOpen}
            handleLogout={handleLogout}
            profileRef={profileRef}
          />
          <Input
            value={globalFilter}
            placeholder="🔍 Search..."
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm 
              dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-600 focus:outline-none"
          />
        </div>

        {/* Center */}
        <div className="flex justify-center w-full sm:w-1/3">
          <h6 className="text-lg font-bold text-gray-800 dark:text-gray-200 text-center">
            {currentTitle}
          </h6>
        </div>

        {/* Right side (desktop only) */}
        <div className="hidden sm:flex w-full sm:w-auto sm:justify-end gap-2 items-center relative">
          {/* Desktop export buttons */}
          <div className="flex gap-2">
            <button
              onClick={onExportExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Export Excel
            </button>
            <button
              onClick={onExportPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Export PDF
            </button>
          </div>

          {/* Desktop user profile */}
          <ProfileDropdown
            isProfileMenuOpen={isProfileMenuOpen}
            setIsProfileMenuOpen={setIsProfileMenuOpen}
            handleLogout={handleLogout}
            profileRef={profileRef}
          />
        </div>

        {/* Mobile Export */}
        <div className="flex sm:hidden w-full gap-2">
          <button
            onClick={onExportExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm w-1/2"
          >
            Export Excel
          </button>
          <button
            onClick={onExportPDF}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm w-1/2"
          >
            Export PDF
          </button>
        </div>
      </nav>
    </header>
  );
};

// ✅ Header left: menu + logo + Hero Fashion + (mobile user icon)
export const HeaderLeftSection = ({
  toggleSidebar,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  handleLogout,
  profileRef,
}) => {
  return (
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

      {/* ✅ Mobile user profile (next to Hero Fashion) */}
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
};

// ✅ ProfileDropdown (desktop)
const ProfileDropdown = ({
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  handleLogout,
  profileRef,
}) => {
  return (
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
};

export default Navbar;
