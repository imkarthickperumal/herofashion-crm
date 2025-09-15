// src/components/Sidebar.jsx
import PropTypes from "prop-types";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { sidebarLinks } from "../constants";
import {
  Home,
  Video,
  TvMinimal,
  UserRound,
  History,
  Clock4,
  Flame,
  Music,
  Gamepad2,
  Trophy,
  TvMinimalPlay,
  ListMusic,
  Tv,
  Settings,
  Flag,
  CircleHelp,
  MessageSquareWarning,
} from "lucide-react";
import { HeaderLeftSection } from "./Navbar";

// ✅ Map icon names to actual components
const iconComponents = {
  Home,
  Video,
  TvMinimal,
  UserRound,
  History,
  Clock4,
  Flame,
  Music,
  Gamepad2,
  Trophy,
  TvMinimalPlay,
  ListMusic,
  Tv,
  Settings,
  Flag,
  CircleHelp,
  MessageSquareWarning,
};

const Sidebar = ({ toggleSidebar, isSidebarOpen, user }) => {
  const location = useLocation();

  // ✅ Close sidebar only on mobile devices
  const handleLinkClick = () => {
    if (window.innerWidth < 768) toggleSidebar();
  };

  // ✅ Filter links: show only Orders for dummy users
  const filteredLinks = user?.isDummy
    ? [
        {
          links: [
            {
              title: "Orders",
              url: "/orders",
            },
          ],
        },
      ]
    : sidebarLinks;

  return (
    <aside
      role="navigation"
      aria-label="Sidebar Menu"
      className={`bg-white dark:bg-neutral-900 z-30 overflow-hidden 
        max-md:absolute max-md:top-0 max-md:h-screen 
        max-md:transition-all max-md:duration-200
        ${
          isSidebarOpen
            ? "max-md:left-0 w-[280px] px-3"
            : "max-md:left-[-100%] w-0 px-0"
        }`}
    >
      {/* ✅ Header visible only on mobile */}
      <div className="md:hidden pb-5 pt-2 px-1 sticky top-0 bg-[#f4f4f4] dark:bg-neutral-900">
        <HeaderLeftSection toggleSidebar={toggleSidebar} />
      </div>

      {/* ✅ Show Dummy User Name */}
      {user?.isDummy && (
        <div className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Logged in as:{" "}
          <span className="font-semibold">{user.name || "Dummy User"}</span>
        </div>
      )}

      {/* ✅ Sidebar Links */}
      <div className="overflow-y-auto h-[calc(100vh-70px)] custom_scrollbar pb-6">
        {filteredLinks.map((category, catIndex) => (
          <div key={catIndex}>
            {category.categoryTitle && (
              <h4 className="text-[15px] font-semibold mb-2 ml-2 mt-4 dark:text-neutral-300">
                {category.categoryTitle}
              </h4>
            )}

            {category.links.map((link, index) => {
              const Icon = iconComponents[link.icon] || null;
              const isActive = location.pathname === link.url;

              return (
                <RouterLink
                  key={`${catIndex}-${index}`}
                  to={link.url}
                  onClick={handleLinkClick}
                  className={`flex items-center py-2.5 px-3 mb-1 text-[15px] rounded-lg whitespace-nowrap transition-colors
                    ${
                      isActive
                        ? "bg-[#7cb547] text-white dark:bg-[#7cb547]"
                        : "hover:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-neutral-300"
                    }`}
                >
                  {Icon && <Icon className="mr-2.5 h-5 w-5" />}
                  {link.title}
                </RouterLink>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  user: PropTypes.object, // ✅ user can be null or dummy
};

export default Sidebar;
