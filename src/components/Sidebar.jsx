import React from "react";
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

const Sidebar = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();

  // function to handle link click
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar(); // close only on mobile
    }
  };

  return (
    <aside
      className={`${
        isSidebarOpen
          ? "max-md:left-0 w-[280px] px-3"
          : "max-md:left-[-100%] w-0 px-0"
      } max-md:absolute max-md:h-screen max-md:top-0 bg-white overflow-hidden z-30 dark:bg-neutral-900 max-md:transition-all max-md:duration-200`}
    >
      {/* Header for mobile */}
      <div className="md:hidden pb-5 pt-2 px-1 sticky top-0 bg-[#f4f4f4] dark:bg-neutral-900">
        <HeaderLeftSection toggleSidebar={toggleSidebar} />
      </div>

      <div className="overflow-y-auto h-[calc(100vh-70px)] custom_scrollbar pb-6">
        {sidebarLinks.map((category, catIndex) => (
          <div key={catIndex}>
            {category.categoryTitle && (
              <h4 className="text-[15px] font-semibold mb-2 ml-2 mt-4 dark:text-neutral-300">
                {category.categoryTitle}
              </h4>
            )}

            {category.links.map((link, index) => {
              const IconComponent = iconComponents[link.icon];
              const isActive = location.pathname === link.url;

              return (
                <RouterLink
                  key={`${catIndex}-${index}`}
                  to={link.url}
                  onClick={handleLinkClick} // ✅ close sidebar on mobile click
                  className={`flex text-[15px] items-center py-2.5 px-3 rounded-lg mb-1 whitespace-nowrap transition-colors
                    ${
                      isActive
                        ? "bg-[#7cb547] text-white dark:bg-[#7cb547]"
                        : "hover:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-neutral-300"
                    }`}
                >
                  {IconComponent && (
                    <IconComponent className="mr-2.5 h-5 w-5" />
                  )}
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

export default Sidebar;
