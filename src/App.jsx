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
import Home from "./pages/Home";
import Server11 from "./pages/Server11";
import Server13 from "./pages/Server13";
import Order from "./pages/Order";
import Rollchecking from "./pages/Rollchecking";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [user, setUser] = useState(null);
  const [exportExcelFn, setExportExcelFn] = useState(() => () => {});
  const [exportPDFFn, setExportPDFFn] = useState(() => () => {});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  // ✅ Handlers
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleExportExcel = () => exportExcelFn();
  const handleExportPDF = () => exportPDFFn();

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar
          toggleSidebar={toggleSidebar}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          user={user} // ✅ pass correct user
          setUser={setUser} // ✅ pass correct setter
        />

        <div className="flex flex-1">
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            user={user}
          />
          <div className="flex-1 overflow-auto p-4">
            <Routes>
              {/* Only API users can access these */}
              {!user.isDummy && (
                <>
                  <Route
                    path="/home"
                    element={
                      <Home
                        globalFilter={globalFilter}
                        setExportExcel={setExportExcelFn}
                        setExportPDF={setExportPDFFn}
                        pageTitle="Home Orders"
                      />
                    }
                  />
                  <Route
                    path="/server11"
                    element={
                      <Server11
                        globalFilter={globalFilter}
                        setExportExcel={setExportExcelFn}
                        setExportPDF={setExportPDFFn}
                        pageTitle="Server 11"
                      />
                    }
                  />
                  <Route
                    path="/server13"
                    element={
                      <Server13
                        globalFilter={globalFilter}
                        setExportExcel={setExportExcelFn}
                        setExportPDF={setExportPDFFn}
                        pageTitle="Server 13"
                      />
                    }
                  />
                </>
              )}
              {/* Orders is always accessible */}
              <Route
                path="/orders"
                element={
                  <Order
                    globalFilter={globalFilter}
                    setExportExcel={setExportExcelFn}
                    setExportPDF={setExportPDFFn}
                    pageTitle="Orders"
                  />
                }
              />
              <Route
                path="/rollchecking"
                element={
                  <Rollchecking
                    globalFilter={globalFilter}
                    setExportExcel={setExportExcelFn}
                    setExportPDF={setExportPDFFn}
                    pageTitle="Roll checking"
                  />
                }
              />
              <Route
                path="*"
                element={<Navigate to={user.isDummy ? "/orders" : "/home"} />}
              />
            </Routes>
            <Toaster />
          </div>
        </div>
      </div>
    </Router>
  );
}
