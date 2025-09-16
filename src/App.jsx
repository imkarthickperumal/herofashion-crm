import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import AttendanceReport from "./pages/AttendanceReport";
import Usercreate from "./pages/Usercreate";
import RootUserLogin from "./pages/RootUserLogin";

function AppLayout({
  children,
  globalFilter,
  setGlobalFilter,
  setUser,
  toggleSidebar,
  isSidebarOpen,
  onExportExcel,
}) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar
        toggleSidebar={toggleSidebar}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onExportExcel={onExportExcel}
        setUser={setUser}
      />
      <div className="flex flex-1">
        <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-auto p-2">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [user, setUser] = useState(null);
  const [rootUser, setRootUser] = useState(false);
  const [exportExcelFn, setExportExcelFn] = useState(() => () => {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (localStorage.getItem("rootUser") === "true") setRootUser(true);
    setLoading(false); // ✅ Done loading
  }, []);

  if (loading) return null; // or show a spinner

  return (
    <Router>
      <MainRoutes
        user={user}
        setUser={setUser}
        rootUser={rootUser}
        setRootUser={setRootUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        exportExcelFn={exportExcelFn}
        setExportExcelFn={setExportExcelFn}
      />
    </Router>
  );
}

function MainRoutes({
  user,
  setUser,
  rootUser,
  setRootUser,
  isSidebarOpen,
  setIsSidebarOpen,
  globalFilter,
  setGlobalFilter,
  exportExcelFn,
  setExportExcelFn,
}) {
  const location = useLocation();

  // ✅ Root login page is outside layout
  if (location.pathname === "/root-user-login") {
    return (
      <Routes>
        <Route
          path="/root-user-login"
          element={<RootUserLogin setRootUser={setRootUser} />}
        />
        <Route path="*" element={<Navigate to="/root-user-login" replace />} />
      </Routes>
    );
  }

  // ✅ Usercreate page is root-only but WITHOUT navbar/sidebar
  if (location.pathname === "/usercreate") {
    return (
      <Routes>
        <Route
          path="/usercreate"
          element={
            rootUser ? (
              <>
                <Toaster />
                <Usercreate setRootUser={setRootUser} />
              </>
            ) : (
              <Navigate to="/root-user-login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/usercreate" replace />} />
      </Routes>
    );
  }

  // ✅ Normal login required for normal pages
  if (!user && !rootUser) return <Login onLogin={setUser} />;

  // ✅ Default App layout with Navbar & Sidebar
  return (
    <AppLayout
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      isSidebarOpen={isSidebarOpen}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      setUser={setUser}
      onExportExcel={() => exportExcelFn()}
    >
      <Routes>
        <Route
          path="/home"
          element={
            <Home
              globalFilter={globalFilter}
              setExportExcel={setExportExcelFn}
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
              pageTitle="Server 13"
            />
          }
        />
        <Route
          path="/orders"
          element={
            <Order
              globalFilter={globalFilter}
              setExportExcel={setExportExcelFn}
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
              pageTitle="Roll Checking"
            />
          }
        />
        <Route
          path="/attendancereport"
          element={
            <AttendanceReport
              globalFilter={globalFilter}
              setExportExcel={setExportExcelFn}
              pageTitle="Attendance Report"
            />
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppLayout>
  );
}
