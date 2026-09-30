import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStore,
  faCalendarCheck,
  faChartLine,
  faArrowRight,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
  const stats = [
    ["Registered users", "2,840", faUsers],
    ["Active salons", "86", faStore],
    ["Bookings", "1,294", faCalendarCheck],
    ["Platform growth", "+24%", faChartLine],
  ];

  return (
    <main className="glow-page min-h-screen px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1500px]">
        <section className="rounded-[20px] border border-[#302720]/10 bg-[#e1d3c0] p-7 sm:p-10 lg:p-12">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#76552f]">
              GLOW administration
            </div>

            <h1 className="mt-3 font-display text-[48px] leading-none tracking-[-0.05em] text-[#302720] sm:text-[60px]">
              Platform overview.
            </h1>

            <p className="mt-4 max-w-[650px] text-[14px] leading-7 text-[#302720]/50">
              Monitor the GLOW marketplace, salons, clients and booking
              activity from one workspace.
            </p>
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

        <section className="mt-9 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-7 sm:p-9">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
                  Platform activity
                </div>

                <h2 className="mt-2 font-display text-[34px] text-[#302720]">
                  Recent activity
                </h2>
              </div>

              <span className="rounded-full bg-[#dfcba9]/55 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#76552f]">
                Live
              </span>
            </div>

            <div className="mt-7 space-y-3">
              {[
                ["New salon registered", "Velvet Beauty House", "12 min ago"],
                ["New client joined", "Sara Mohammed", "28 min ago"],
                ["Booking completed", "Luna Beauty Lounge", "41 min ago"],
                ["Salon profile updated", "Glow Beauty Studio", "1 hr ago"],
              ].map(([title, name, time]) => (
                <div
                  key={`${title}-${name}`}
                  className="flex gap-4 rounded-[11px] border border-[#302720]/8 bg-[#eee5d8]/50 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                    <FontAwesomeIcon
                      icon={
                        title.includes("Booking")
                          ? faCalendarCheck
                          : title.includes("salon")
                          ? faStore
                          : faUsers
                      }
                      className="text-[11px]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-extrabold text-[#302720]">
                      {title}
                    </div>

                    <div className="mt-1 text-[10px] text-[#302720]/45">
                      {name}
                    </div>
                  </div>

                  <div className="shrink-0 text-[9px] font-bold text-[#302720]/30">
                    {time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[17px] border border-[#302720]/10 bg-[#e1d3c0] p-7 sm:p-9">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#76552f]">
              Attention
            </div>

            <h2 className="mt-2 font-display text-[34px] text-[#302720]">
              Needs review
            </h2>

            <div className="mt-7 space-y-4">
              <div className="rounded-[12px] bg-[#f5eee4]/65 p-5">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="text-[#9a7444]"
                  />

                  <span className="text-[12px] font-extrabold">
                    3 salon profiles
                  </span>
                </div>

                <p className="mt-2 text-[10px] leading-5 text-[#302720]/45">
                  Require profile verification before appearing publicly.
                </p>
              </div>

              <div className="rounded-[12px] bg-[#f5eee4]/65 p-5">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-[#61745b]"
                  />

                  <span className="text-[12px] font-extrabold">
                    All systems operational
                  </span>
                </div>

                <p className="mt-2 text-[10px] leading-5 text-[#302720]/45">
                  GLOW services are currently running normally.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 pb-16">
          <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-7 sm:p-9">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
              Administration
            </div>

            <h2 className="mt-2 font-display text-[34px] text-[#302720]">
              Quick management
            </h2>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {[
                ["Manage salons", "/salons"],
                ["View bookings", "/bookings"],
                ["Manage users", "/client-dashboard"],
              ].map(([label, path]) => (
                <Link
                  key={label}
                  to={path}
                  className="flex h-[52px] items-center justify-between rounded-[10px] border border-[#76552f]/20 bg-[#dfcba9]/45 px-5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#76552f] transition-all hover:-translate-y-0.5 hover:bg-[#dfcba9]"
                >
                  {label}
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;