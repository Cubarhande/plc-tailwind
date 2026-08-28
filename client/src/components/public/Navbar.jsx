import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "http://localhost:5000";

const Navbar = () => {
  const [settings, setSettings] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get("/settings");

        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );
      }
    };

    fetchSettings();
  }, []);

  const links = [
    ["Home", "/"],
    ["About", "/about"],
    ["What We Do", "/what-we-do"],
    ["Causes", "/causes"],
    ["Events", "/events"],
    ["Contact", "/contact"],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">

      {/* ================= MAIN NAVBAR ================= */}

      <div className="container-custom flex h-16 items-center justify-between">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          onClick={() => setMobileMenu(false)}
          className="flex min-w-0 items-center"
        >
          {settings?.logo ? (
            <img
              src={`${IMAGE_URL}${settings.logo}`}
              alt={
                settings?.siteName ||
                "PLC Organisation"
              }
              className="h-12 w-auto max-w-[180px] object-contain sm:h-14"
            />
          ) : (
            <span className="truncate text-lg font-bold text-slate-900 sm:text-xl">
              {settings?.siteName ||
                "PLC Organisation"}
            </span>
          )}
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map(([name, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm font-medium transition ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </nav>

        {/* ================= MOBILE BUTTON ================= */}

        <button
          type="button"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={
            mobileMenu
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* ================= MOBILE NAV ================= */}

      {mobileMenu && (
        <div className="border-t border-slate-200 bg-white lg:hidden">

          <nav className="container-custom py-3">

            {links.map(([name, path]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() =>
                  setMobileMenu(false)
                }
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;