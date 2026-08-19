import { useCallback } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  GridIcon,
  PaymentIcon,FeedbackIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <FeedbackIcon />,
    name: "FeedbackList",
    path: "/FeedbackList",
  },
   {
    icon: <FeedbackIcon />,
    name: "Onboarding",
    path: "/Onboarding",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PaymentIcon />,
    name: "Payment List",
    path: "/payment",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            to={nav.path}
            className={`menu-item group ${
              isActive(nav.path)
                ? "menu-item-active !bg-white dark:!bg-white !text-[#1878b1] dark:!text-[#1878b1]"
                : "menu-item-inactive hover:bg-white/10 dark:hover:bg-white/10"
            } ${
              !isExpanded && !isHovered
                ? "lg:justify-center"
                : "lg:justify-start"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {/* Icon in a rounded container for a cleaner, professional look */}
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-200 [&_svg]:w-[16px] [&_svg]:h-[16px] [&_svg]:fill-current [&_svg]:stroke-current ${
                  isActive(nav.path)
                    ? "!bg-[#1878b1]/10 dark:!bg-[#1878b1]/10 !text-[#1878b1] dark:!text-[#1878b1]"
                    : "bg-white/10 text-white dark:bg-white/10 dark:text-white group-hover:bg-white/20 dark:group-hover:bg-white/20"
                }`}
              >
                {nav.icon}
              </span>
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span
                className={`menu-item-text ${
                  isActive(nav.path)
                    ? "!text-[#1878b1] dark:!text-[#1878b1] font-semibold"
                    : "text-white dark:text-white"
                }`}
              >
                {nav.name}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#1878b1] dark:!bg-[#0F1828] dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex !bg-white dark:!bg-[#0F1828] -mx-5 px-5 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo-pp.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-pp-dark.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-pp-small.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
<div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar p-2">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {renderMenuItems(navItems)}
            </div>
            <div className="">
              {renderMenuItems(othersItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;