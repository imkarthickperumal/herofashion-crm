import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Import pages
import Home from "./pages/Home";
import EMPWise from "./pages/EMPWise";
import Overall from "./pages/Overall";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

  return (
    <Router>
      <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex overflow-auto">
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Overlay for mobile */}
          <div
            onClick={toggleSidebar}
            className={`md:hidden ${
              !isSidebarOpen && "opacity-0 pointer-events-none"
            } transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
          ></div>

          {/* Page content */}
          <div
            className={`w-full px-1 overflow-x-hidden custom_scrollbar ${
              isSidebarOpen && "hide_thumb"
            }`}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/overall" element={<Overall />} />
              <Route path="/empwise" element={<EMPWise />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
