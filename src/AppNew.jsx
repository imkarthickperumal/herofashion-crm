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

// Import pages
import Home from "./pages/Home";
import EMPWise from "./pages/EMPWise";
import Overall from "./pages/Overall";
import TXorder from "./pages/TXorder";
import Chennai from "./pages/Chennai";
import Server11 from "./pages/Server11";
import Server13 from "./pages/Server13";
import Demo from "./pages/Demo";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  // Navbar actions
  const [addNewFn, setAddNewFn] = useState(null);
  const [exportExcelFn, setExportExcelFn] = useState(null);
  const [exportPDFFn, setExportPDFFn] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

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
                  />
                }
              />
              <Route
                path="/overall"
                element={
                  <Overall
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
                  />
                }
              />
              <Route
                path="/empwise"
                element={
                  <EMPWise
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
                  />
                }
              />
              <Route
                path="/tx_order"
                element={
                  <TXorder
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
                  />
                }
              />
              <Route
                path="/"
                element={
                  <Chennai
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
                  />
                }
              />
              <Route
                path="/chennai"
                element={
                  <Chennai
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
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
                  />
                }
              />
              <Route
                path="/demo"
                element={
                  <Demo
                    globalFilter={globalFilter}
                    onAddNew={setAddNewFn}
                    onExportExcel={setExportExcelFn}
                    onExportPDF={setExportPDFFn}
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
