import { Menu } from "lucide-react";
import Logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

const Navbar = ({
  toggleSidebar,
  globalFilter,
  setGlobalFilter,
  onAddNew,
  onExportExcel,
  onExportPDF,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.body.classList[isDarkMode ? "add" : "remove"]("dark");
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900 shadow-sm">
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-4 gap-3">
        {/* Left side: Logo + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-1/2">
          <HeaderLeftSection toggleSidebar={toggleSidebar} />
          <Input
            value={globalFilter}
            placeholder="🔍 Search..."
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-80 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm 
              dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-600 focus:outline-none"
          />
        </div>

        {/* Right side: Action buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* <button
            onClick={onAddNew}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            ➕ Add New
          </button> */}
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
      </nav>
    </header>
  );
};

export const HeaderLeftSection = ({ toggleSidebar }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-full hover:bg-neutral-200 hover:dark:bg-neutral-700"
      >
        <Menu className="dark:text-neutral-400" />
      </button>
      <a className="flex items-center gap-2" href="#">
        <img src={Logo} width={32} alt="Logo" />
        <h2 className="text-lg sm:text-xl font-bold dark:text-neutral-300">
          Hero Fashion
        </h2>
      </a>
    </div>
  );
};

export default Navbar;
