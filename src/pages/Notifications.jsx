import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarCheck,
  faCheck,
  faArrowRight,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

const notifications = [
  {
    id: 1,
    type: "booking",
    title: "Booking confirmed",
    text: "Your appointment at Luna Beauty Lounge has been confirmed.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "reminder",
    title: "Appointment reminder",
    text: "Your beauty appointment is tomorrow at 17:00.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    type: "info",
    title: "New salons on GLOW",
    text: "Discover new beauty spaces now available in Basra.",
    time: "3 days ago",
    unread: false,
  },
];

function Notifications() {
  return (
    <main className="glow-page min-h-screen px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1050px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9a7444]">
              Your GLOW activity
            </div>

            <h1 className="mt-2 font-display text-[48px] tracking-[-0.05em] text-[#302720]">
              Notifications
            </h1>
          </div>

          <button className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#9a7444]">
            Mark all as read
          </button>
        </div>

        <div className="mt-9 overflow-hidden rounded-[18px] border border-[#302720]/10 bg-[#f5eee4]">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`flex gap-5 p-6 sm:p-7 ${
                index !== notifications.length - 1
                  ? "border-b border-[#302720]/10"
                  : ""
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                <FontAwesomeIcon
                  icon={
                    notification.type === "booking"
                      ? faCalendarCheck
                      : notification.type === "reminder"
                      ? faBell
                      : faCircleInfo
                  }
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-[23px] text-[#302720]">
                    {notification.title}
                  </h2>

                  {notification.unread && (
                    <span className="h-2 w-2 rounded-full bg-[#9a7444]" />
                  )}
                </div>

                <p className="mt-2 max-w-[700px] text-[13px] leading-6 text-[#302720]/50">
                  {notification.text}
                </p>

                <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#302720]/30">
                  {notification.time}
                </div>
              </div>

              {notification.type === "booking" && (
                <Link
                  to="/bookings"
                  className="hidden h-[42px] shrink-0 items-center gap-2 rounded-[9px] border border-[#76552f]/25 bg-[#dfcba9]/55 px-4 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#76552f] transition-colors hover:bg-[#dfcba9] sm:flex"
                >
                  View
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[15px] border border-[#302720]/10 bg-[#e1d3c0] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eee4] text-[#61745b]">
              <FontAwesomeIcon icon={faCheck} />
            </div>

            <div>
              <div className="text-[12px] font-extrabold text-[#302720]">
                You're all caught up
              </div>

              <div className="mt-1 text-[11px] text-[#302720]/45">
                We'll let you know when something needs your attention.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Notifications;