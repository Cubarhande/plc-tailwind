import {
  LayoutDashboard,
  Image,
  FileText,
  Layers,
  CreditCard,
  Heart,
  Handshake,
  CalendarDays,
  ListChecks,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Hero",
    path: "/admin/hero",
    icon: Image,
  },
  {
    name: "About",
    path: "/admin/about",
    icon: FileText,
  },
  {
    name: "About Categories",
    path: "/admin/about/categories",
    icon: Layers,
  },
  {
    name: "About Cards",
    path: "/admin/about/cards",
    icon: CreditCard,
  },
  {
    name: "What We Do Categories",
    path: "/admin/categories",
    icon: Layers,
  },
  {
    name: "What We Do Cards",
    path: "/admin/cards",
    icon: CreditCard,
  },
  {
    name: "Causes",
    path: "/admin/causes",
    icon: Heart,
  },
  {
    name: "Partners",
    path: "/admin/partners",
    icon: Handshake,
  },

  // Independent Events
  {
    name: "Events",
    path: "/admin/events",
    icon: CalendarDays,
  },

  // Independent Event Cards
  {
    name: "Event Cards",
    path: "/admin/event-cards",
    icon: ListChecks,
  },

  {
    name: "Messages",
    path: "/admin/contacts",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-950 text-white">
      {/* LOGO */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-xl font-bold">PLC Admin</h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-white font-semibold text-slate-900"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* LOGOUT */}
      {/* <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div> */}
    </aside>
  );
};

export default Sidebar;
