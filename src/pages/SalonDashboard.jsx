import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faUsers,
  faScissors,
  faChartLine,
  faArrowRight,
  faPlus,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

function SalonDashboard() {
  const navigate = useNavigate();
  const [salonAccount] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("glow_user") || "null");
      return {
        name: user?.salon_name || user?.full_name || "Salon workspace",
        profilePath: user?.salon_id ? `/salons/${user.salon_id}` : "/salons",
      };
    } catch {
      return { name: "Salon workspace", profilePath: "/salons" };
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("glow_token");
    localStorage.removeItem("glow_user");
    navigate("/login");
  };

  const stats = [
    ["Today's bookings", "12", faCalendarCheck],
    ["Clients", "248", faUsers],
    ["Services", "18", faScissors],
    ["Monthly revenue", "$4,820", faChartLine],
  ];

  return (
    <main className="glow-page min-h-screen px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1500px]">
        <section className="rounded-[20px] border border-[#302720]/10 bg-[#e1d3c0] p-7 sm:p-10 lg:p-12">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#76552f]">
                Salon workspace
              </div>

              <h1 className="mt-3 font-display text-[48px] leading-none tracking-[-0.05em] text-[#302720] sm:text-[60px]">
                {salonAccount.name}
              </h1>

              <p className="mt-4 text-[13px] text-[#302720]/50">
                Manage your salon, services and daily appointments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-[50px] items-center justify-center rounded-[10px] border border-[#76552f]/30 bg-transparent px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#76552f] transition-all hover:bg-[#f5eee4]"
              >
                Logout
              </button>

              <Link
                to={salonAccount.profilePath}
                className="inline-flex h-[50px] items-center justify-center gap-3 rounded-[10px] border border-[#76552f]/30 bg-[#9a7444] px-6 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#fffaf2] transition-all hover:bg-[#76552f]"
              >
                View public profile
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, icon]) => (
            <div
              key={label}
              className="rounded-[15px] border border-[#302720]/10 bg-[#f5eee4] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                <FontAwesomeIcon icon={icon} />
              </div>

              <div className="mt-5 font-display text-[34px] text-[#302720]">
                {value}
              </div>

              <div className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/35">
                {label}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-9 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-7 sm:p-9">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
                  Today
                </div>

                <h2 className="mt-2 font-display text-[34px] text-[#302720]">
                  Appointments
                </h2>
              </div>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9] text-[#76552f]">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            <div className="mt-7 space-y-3">
              {[
                ["10:00", "Maya A.", "Signature Makeup"],
                ["13:30", "Sara M.", "Hair Styling"],
                ["17:00", "Noor K.", "Bridal Makeup"],
              ].map(([time, client, service]) => (
                <div
                  key={time}
                  className="flex flex-col gap-4 rounded-[12px] border border-[#302720]/8 bg-[#eee5d8]/55 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#9a7444]">
                    <FontAwesomeIcon icon={faClock} />
                    {time}
                  </div>

                  <div className="flex-1">
                    <div className="text-[13px] font-extrabold text-[#302720]">
                      {client}
                    </div>

                    <div className="mt-1 text-[10px] text-[#302720]/40">
                      {service}
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-[#dfcba9]/55 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#76552f]">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[17px] border border-[#302720]/10 bg-[#e1d3c0] p-7 sm:p-9">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#76552f]">
              Quick actions
            </div>

            <h2 className="mt-2 font-display text-[32px] text-[#302720]">
              Manage your space
            </h2>

            <div className="mt-7 space-y-3">
              {[
                "Add a new service",
                "Update salon information",
                "Manage working hours",
                "Review client bookings",
              ].map((item) => (
                <button
                  key={item}
                  className="flex w-full items-center justify-between rounded-[10px] border border-[#302720]/10 bg-[#f5eee4]/65 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-[#f5eee4]"
                >
                  <span className="text-[11px] font-bold text-[#302720]/65">
                    {item}
                  </span>

                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[10px] text-[#9a7444]"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 pb-16">
          <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
                  GLOW performance
                </div>

                <h2 className="mt-2 font-display text-[30px] text-[#302720]">
                  Your salon is growing
                </h2>
              </div>

              <div className="text-right">
                <div className="font-display text-[32px] text-[#9a7444]">
                  +18%
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#302720]/35">
                  This month
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SalonDashboard;