import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";

// Import pages

import Home from "./pages/Home";
import Server11 from "./pages/Server11";
import Server13 from "./pages/Server13";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [user, setUser] = useState(null); // ✅ track login user

  // Navbar actions
  const [addNewFn, setAddNewFn] = useState(null);
  const [exportExcelFn, setExportExcelFn] = useState(null);
  const [exportPDFFn, setExportPDFFn] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Keep user logged in if data exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

  if (!user) {
    // ✅ show login page only if user is not authenticated
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-900">
        {/* Navbar */}
        <Navbar
          toggleSidebar={toggleSidebar}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onAddNew={() => addNewFn && addNewFn()}
          onExportExcel={() => exportExcelFn && exportExcelFn()}
          onExportPDF={() => exportPDFFn && exportPDFFn()}
          setUser={setUser}
        />

        <div className="flex overflow-auto">
          {/* Sidebar */}
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Overlay for mobile */}
          <div
            onClick={toggleSidebar}
            className={`md:hidden ${
              !isSidebarOpen && "opacity-0 pointer-events-none"
            } 
              transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
          ></div>

          {/* Page content */}
          <div
            className={`w-full px-1 overflow-x-hidden custom_scrollbar ${
              isSidebarOpen && "hide_thumb"
            }`}
          >
            <Routes>
              <Route
                path="/home"
                element={
                  <Home
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
                    pageTitle="Home Orders"
                  />
                }
              />

              <Route
                path="/server11"
                element={
                  <Server11
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
                    pageTitle="Server 11"
                  />
                }
              />
              <Route
                path="/server13"
                element={
                  <Server13
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
                    pageTitle="Server 13"
                  />
                }
              />

              {/* Catch invalid routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        </div>
      </div>
    </Router>
  );
}
