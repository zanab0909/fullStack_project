import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faArrowRight,
  faUser,
  faCalendarCheck,
  faStore,
  faScissors,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Salons", to: "/salons" },
  { label: "Services", to: "/services" },
  { label: "Bookings", to: "/bookings" },
  { label: "About", to: "/about" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1580px]">
        <div className="overflow-hidden rounded-[20px] border border-[#302720]/15 bg-[#e8dece]/72 shadow-[0_14px_50px_rgba(48,39,32,0.12)] backdrop-blur-[24px]">

          <div className="flex min-h-[88px] items-center justify-between px-4 sm:px-6 lg:px-8">

            <Link
              to="/"
              onClick={closeMenu}
              className="group flex shrink-0 items-center gap-3.5"
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-[#302720]/20 bg-[#302720] shadow-[0_8px_25px_rgba(48,39,32,0.16)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_30px_rgba(48,39,32,0.22)]">
                <span className="font-display text-[26px] font-semibold leading-none text-[#eee5d8]">
                  G
                </span>
              </div>

              <div className="hidden sm:block">
                <div className="font-display text-[30px] font-semibold leading-none tracking-[-0.055em] text-[#302720]">
                  GLOW
                </div>

                <div className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.27em] text-[#76552f]">
                  Beauty Platform
                </div>
              </div>
            </Link>

            <nav className="hidden items-center rounded-[15px] border border-[#302720]/10 bg-[#f5eee4]/40 p-1.5 lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="group"
                >
                  {({ isActive }) => (
                    <div
                      className={`relative rounded-[11px] px-5 py-3.5 text-[15px] font-bold transition-all duration-300 xl:px-6 ${
                        isActive
                          ? "bg-[#302720] text-[#f5eee4] shadow-[0_6px_20px_rgba(48,39,32,0.15)]"
                          : "text-[#302720]/72 hover:bg-[#302720]/8 hover:text-[#302720]"
                      }`}
                    >
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2.5 lg:flex">
              <Link
                to="/login"
                className="flex h-[52px] items-center gap-2.5 rounded-[11px] px-5 text-[14px] font-bold text-[#302720]/75 transition-all duration-300 hover:bg-[#302720]/7 hover:text-[#302720]"
              >
                <FontAwesomeIcon icon={faUser} className="text-[12px]" />
                Login
              </Link>

              <Link
                to="/register"
                className="flex h-[52px] items-center gap-3 rounded-[11px] border border-[#76552f]/40 bg-[#9a7444] px-6 text-[12px] font-extrabold uppercase tracking-[0.09em] text-[#fffaf2] shadow-[0_8px_25px_rgba(118,85,47,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#76552f] hover:shadow-[0_12px_30px_rgba(118,85,47,0.25)]"
              >
                Create Account
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-[11px] border border-[#302720]/15 bg-[#f5eee4]/55 text-[#302720] transition-all duration-300 hover:bg-[#302720] hover:text-[#f5eee4] lg:hidden"
            >
              <FontAwesomeIcon
                icon={menuOpen ? faXmark : faBars}
                className="text-[19px]"
              />
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-[#302720]/10 px-4 pb-5 pt-4 lg:hidden">
              <nav className="flex flex-col gap-1.5 rounded-[14px] border border-[#302720]/10 bg-[#f5eee4]/50 p-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                  >
                    {({ isActive }) => (
                      <div
                        className={`flex min-h-[58px] items-center justify-between rounded-[10px] px-5 text-[16px] font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-[#302720] text-[#f5eee4]"
                            : "text-[#302720]/75 hover:bg-[#302720]/8 hover:text-[#302720]"
                        }`}
                      >
                        <span>{item.label}</span>

                        <span
                          className={`h-2 w-2 rounded-full ${
                            isActive
                              ? "bg-[#c5a477]"
                              : "bg-transparent"
                          }`}
                        />
                      </div>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex h-[54px] items-center justify-center gap-2.5 rounded-[10px] border border-[#302720]/15 bg-[#f5eee4]/60 text-[14px] font-bold text-[#302720]"
                >
                  <FontAwesomeIcon icon={faUser} className="text-[12px]" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex h-[54px] items-center justify-center gap-2 rounded-[10px] bg-[#9a7444] text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#fffaf2]"
                >
                  Create Account
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[10px]"
                  />
                </Link>
              </div>

              <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-[11px] border border-[#302720]/10 bg-[#f5eee4]/45">
                <Link
                  to="/salons"
                  onClick={closeMenu}
                  className="flex flex-col items-center gap-2 border-r border-[#302720]/10 py-4 text-[#302720]/70 transition-colors hover:bg-[#302720]/7"
                >
                  <FontAwesomeIcon icon={faStore} className="text-[14px]" />
                  <span className="text-[12px] font-bold">Salons</span>
                </Link>

                <Link
                  to="/services"
                  onClick={closeMenu}
                  className="flex flex-col items-center gap-2 border-r border-[#302720]/10 py-4 text-[#302720]/70 transition-colors hover:bg-[#302720]/7"
                >
                  <FontAwesomeIcon icon={faScissors} className="text-[14px]" />
                  <span className="text-[12px] font-bold">Services</span>
                </Link>

                <Link
                  to="/bookings"
                  onClick={closeMenu}
                  className="flex flex-col items-center gap-2 py-4 text-[#302720]/70 transition-colors hover:bg-[#302720]/7"
                >
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="text-[14px]"
                  />
                  <span className="text-[12px] font-bold">Bookings</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;