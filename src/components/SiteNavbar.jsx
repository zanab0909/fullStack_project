import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faCalendarCheck,
  faScissors,
  faStore,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Salons", to: "/salons" },
  { label: "Services", to: "/services" },
  { label: "Bookings", to: "/bookings" },
  { label: "About", to: "/about" },
];

function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminDashboard = location.pathname === "/admin-dashboard";
  let currentUser;

  try {
    currentUser = JSON.parse(localStorage.getItem("glow_user") || "null");
  } catch {
    currentUser = null;
  }
  const profilePath = currentUser?.role === "salon"
    ? currentUser.salon_id
      ? `/salons/${currentUser.salon_id}`
      : "/salons"
    : "/profile";
  const profileName = currentUser?.role === "salon"
    ? currentUser.salon_name || currentUser.full_name || "Salon profile"
    : currentUser?.full_name || "My profile";

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("glow_token");
    localStorage.removeItem("glow_user");
    closeMenu();
    navigate("/login");
  };

  return (
    <header className={`${isAdminDashboard ? "relative" : "sticky top-0"} z-50 px-3 pt-3 sm:px-5 lg:px-7`}>
      <div className="mx-auto max-w-[1580px]">
        <div className="overflow-hidden rounded-[20px] border border-[#302720]/15 bg-[#e8dece]/90 shadow-[0_14px_50px_rgba(48,39,32,0.12)] backdrop-blur-[24px]">
          <div className="flex min-h-[82px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link to="/" onClick={closeMenu} className="group flex shrink-0 items-center gap-3.5">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] border border-[#302720]/20 bg-[#302720] text-[#eee5d8] shadow-[0_8px_25px_rgba(48,39,32,0.16)] transition-transform group-hover:-translate-y-0.5">
                <span className="font-display text-[26px] font-semibold leading-none">G</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-[28px] font-semibold leading-none text-[#302720]">GLOW</div>
                <div className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#76552f]">Beauty Platform</div>
              </div>
            </Link>

            <nav aria-label="Main navigation" className="hidden items-center rounded-[15px] border border-[#302720]/10 bg-[#f5eee4]/40 p-1.5 lg:flex">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeMenu}>
                  {({ isActive }) => (
                    <span className={`block rounded-[10px] px-4 py-3 text-[13px] font-bold transition-colors xl:px-5 ${isActive ? "bg-[#302720] text-[#f5eee4]" : "text-[#302720]/75 hover:bg-[#302720]/8"}`}>
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              {currentUser ? (
                <>
                  <Link to={profilePath} onClick={closeMenu} className="rounded-[9px] px-3 py-2 text-right transition-colors hover:bg-[#302720]/7">
                    <span className="block text-[12px] font-extrabold text-[#302720]">{profileName}</span>
                    <span className="block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#9a7444]">{currentUser.role === "salon" ? "Salon profile" : currentUser.role}</span>
                  </Link>
                  <button type="button" onClick={handleLogout} className="flex h-[46px] items-center rounded-[10px] border border-[#76552f]/30 px-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#76552f] transition-colors hover:bg-[#302720] hover:text-[#f5eee4]">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex h-[46px] items-center gap-2 rounded-[10px] px-4 text-[13px] font-bold text-[#302720]/75 hover:bg-[#302720]/7">
                    <FontAwesomeIcon icon={faUser} className="text-[11px]" /> Login
                  </Link>
                  <Link to="/register" className="flex h-[46px] items-center gap-3 rounded-[10px] bg-[#9a7444] px-5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#fffaf2] transition-colors hover:bg-[#76552f]">
                    Create account <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </Link>
                </>
              )}
            </div>

            <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} className="flex h-[46px] w-[46px] items-center justify-center rounded-[10px] border border-[#302720]/15 bg-[#f5eee4]/60 text-[#302720] lg:hidden">
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-[#302720]/10 px-4 pb-4 pt-3 lg:hidden">
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 rounded-[12px] border border-[#302720]/10 bg-[#f5eee4]/55 p-2">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={closeMenu}>
                    {({ isActive }) => (
                      <span className={`flex min-h-11 items-center rounded-[9px] px-4 text-[13px] font-bold ${isActive ? "bg-[#302720] text-[#f5eee4]" : "text-[#302720]/75 hover:bg-[#302720]/8"}`}>
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>

              {currentUser ? (
                <div className="mt-3 flex items-center justify-between rounded-[10px] border border-[#302720]/10 bg-[#f5eee4]/60 p-3">
                  <Link to={profilePath} onClick={closeMenu} className="min-w-0 rounded-[8px] px-2 py-1">
                    <span className="block truncate text-[12px] font-extrabold text-[#302720]">{profileName}</span>
                    <span className="block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#9a7444]">{currentUser.role === "salon" ? "Salon profile" : currentUser.role}</span>
                  </Link>
                  <button type="button" onClick={handleLogout} className="rounded-[9px] bg-[#302720] px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#f5eee4]">Logout</button>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={closeMenu} className="flex h-[48px] items-center justify-center gap-2 rounded-[9px] border border-[#302720]/15 bg-[#f5eee4]/60 text-[12px] font-bold text-[#302720]">
                    <FontAwesomeIcon icon={faUser} /> Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="flex h-[48px] items-center justify-center gap-2 rounded-[9px] bg-[#9a7444] text-[10px] font-extrabold uppercase text-[#fffaf2]">
                    Create account <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-[10px] border border-[#302720]/10 bg-[#f5eee4]/45">
                <Link to="/salons" onClick={closeMenu} className="flex flex-col items-center gap-2 border-r border-[#302720]/10 py-3 text-[#302720]/70">
                  <FontAwesomeIcon icon={faStore} /><span className="text-[11px] font-bold">Salons</span>
                </Link>
                <Link to="/services" onClick={closeMenu} className="flex flex-col items-center gap-2 border-r border-[#302720]/10 py-3 text-[#302720]/70">
                  <FontAwesomeIcon icon={faScissors} /><span className="text-[11px] font-bold">Services</span>
                </Link>
                <Link to="/bookings" onClick={closeMenu} className="flex flex-col items-center gap-2 py-3 text-[#302720]/70">
                  <FontAwesomeIcon icon={faCalendarCheck} /><span className="text-[11px] font-bold">Bookings</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default SiteNavbar;
