import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faArrowRight,
  faHeart,
  faClock,
  faLocationDot,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { apiCall } from "../api";

function ClientDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("glow_token");
    localStorage.removeItem("glow_user");
    navigate("/login");
  };

  // ---------------------------------------------------------
  // LOAD CURRENT USER BOOKINGS
  // ---------------------------------------------------------
  useEffect(() => {
    const loadBookings = async () => {
      const token = localStorage.getItem("glow_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setDashboardError("");

        const result = await apiCall(
          "/bookings/my",
          "GET",
          null,
          token
        );

        const data = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
        setDashboardError(
          error.message || "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // ---------------------------------------------------------
  // DATE HELPERS
  // ---------------------------------------------------------
  const getBookingDateTime = (booking) => {
    const date = booking?.booking_date;
    const time = booking?.booking_time || "00:00";

    if (!date) return null;

    const parsed = new Date(`${date}T${time}`);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const today = useMemo(() => {
    const now = new Date();

    now.setHours(0, 0, 0, 0);

    return now;
  }, []);

  // ---------------------------------------------------------
  // UPCOMING BOOKINGS
  // ---------------------------------------------------------
  const upcomingBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const date = getBookingDateTime(booking);

        if (!date) return false;

        return (
          date >= today &&
          !["cancelled", "completed"].includes(
            String(booking.status || "").toLowerCase()
          )
        );
      })
      .sort((a, b) => {
        const dateA = getBookingDateTime(a);
        const dateB = getBookingDateTime(b);

        return dateA - dateB;
      });
  }, [bookings, today]);

  // ---------------------------------------------------------
  // COMPLETED BOOKINGS
  // ---------------------------------------------------------
  const completedBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const status = String(
        booking.status || ""
      ).toLowerCase();

      const date = getBookingDateTime(booking);

      return (
        status === "completed" ||
        (date && date < today && status !== "cancelled")
      );
    });
  }, [bookings, today]);

  // ---------------------------------------------------------
  // NEXT APPOINTMENT
  // ---------------------------------------------------------
  const nextAppointment = upcomingBookings[0] || null;

  // ---------------------------------------------------------
  // FORMAT DATE
  // ---------------------------------------------------------
  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ---------------------------------------------------------
  // FORMAT TIME
  // ---------------------------------------------------------
  const formatTime = (timeValue) => {
    if (!timeValue) return "Time not available";

    const [hourString, minuteString] =
      String(timeValue).split(":");

    let hour = Number(hourString);
    const minute = minuteString || "00";

    if (Number.isNaN(hour)) {
      return timeValue;
    }

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${String(hour).padStart(2, "0")}:${minute} ${period}`;
  };

  // ---------------------------------------------------------
  // SALON NAME
  // ---------------------------------------------------------
  const getSalonName = (booking) => {
    return (
      booking?.salon_name ||
      booking?.salon?.name ||
      booking?.salonName ||
      "GLOW Salon"
    );
  };

  // ---------------------------------------------------------
  // SALON LOCATION
  // ---------------------------------------------------------
  const getSalonLocation = (booking) => {
    return (
      booking?.salon_address ||
      booking?.salon?.address ||
      booking?.location ||
      "Basra · Iraq"
    );
  };

  // ---------------------------------------------------------
  // SERVICE NAME
  // ---------------------------------------------------------
  const getServiceName = (booking) => {
    return (
      booking?.service_name ||
      booking?.service?.name ||
      booking?.serviceName ||
      "Beauty Service"
    );
  };

  // ---------------------------------------------------------
  // SALON IMAGE
  // ---------------------------------------------------------
  const getSalonImage = (booking) => {
    return (
      booking?.salon_image ||
      booking?.salon?.image ||
      booking?.salon?.image_url ||
      "/images/salon-export.jpg"
    );
  };

  // ---------------------------------------------------------
  // STATUS
  // ---------------------------------------------------------
  const getStatusLabel = (booking) => {
    const status = String(
      booking?.status || "pending"
    ).toLowerCase();

    if (status === "confirmed") return "Confirmed";
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";
    if (status === "pending") return "Pending";

    return booking?.status || "Pending";
  };

  // ---------------------------------------------------------
  // USER NAME
  // ---------------------------------------------------------
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("glow_user") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const userName =
    storedUser?.full_name ||
    storedUser?.name ||
    "there";

  // ---------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------
  return (
    <main className="glow-page min-h-screen px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1500px]">

        {/* -------------------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------------------- */}

        <section className="rounded-[20px] border border-[#302720]/10 bg-[#e1d3c0] p-7 sm:p-10 lg:p-12">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#76552f]">
                Client dashboard
              </div>

              <h1 className="mt-3 font-display text-[48px] leading-none tracking-[-0.05em] text-[#302720] sm:text-[60px]">
                Welcome back{userName !== "there" ? `, ${userName}` : "."}
              </h1>

              <p className="mt-4 max-w-[600px] text-[14px] leading-7 text-[#302720]/50">
                Manage your appointments, discover salons and keep your beauty
                routine organised.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-[52px] items-center justify-center rounded-[10px] border border-[#76552f]/35 bg-transparent px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#76552f] transition-all hover:bg-[#f5eee4]"
              >
                Logout
              </button>

              <Link
                to="/salons"
                className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[10px] border border-[#76552f]/35 bg-[#9a7444] px-6 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#fffaf2] shadow-[0_8px_25px_rgba(118,85,47,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#76552f]"
              >
                Explore salons
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* ERROR */}
        {/* -------------------------------------------------- */}

        {dashboardError && (
          <div className="mt-5 rounded-[12px] border border-red-900/10 bg-[#f3e4d9] px-5 py-4 text-[13px] text-[#744332]">
            {dashboardError}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* STATS */}
        {/* -------------------------------------------------- */}

        <section className="mt-7 grid gap-5 md:grid-cols-3">
          {[
            [
              "Upcoming",
              loading ? "—" : String(upcomingBookings.length),
              faCalendarCheck,
            ],
            [
              "Completed",
              loading ? "—" : String(completedBookings.length),
              faClock,
            ],
            [
              "Favourites",
              "4",
              faHeart,
            ],
          ].map(([label, value, icon]) => (
            <div
              key={label}
              className="rounded-[15px] border border-[#302720]/10 bg-[#f5eee4] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                <FontAwesomeIcon icon={icon} />
              </div>

              <div className="mt-5 font-display text-[38px] text-[#302720]">
                {value}
              </div>

              <div className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/40">
                {label}
              </div>
            </div>
          ))}
        </section>

        {/* -------------------------------------------------- */}
        {/* NEXT APPOINTMENT */}
        {/* -------------------------------------------------- */}

        <section className="mt-9">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
                Your next visit
              </div>

              <h2 className="mt-2 font-display text-[36px] text-[#302720]">
                Upcoming appointment
              </h2>
            </div>

            <Link
              to="/bookings"
              className="hidden text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#9a7444] sm:block"
            >
              View bookings
            </Link>
          </div>

          {loading ? (
            <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-10 text-center text-[13px] text-[#302720]/45">
              Loading your appointments...
            </div>
          ) : !nextAppointment ? (
            <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>

              <h3 className="mt-5 font-display text-[28px] text-[#302720]">
                No upcoming appointments
              </h3>

              <p className="mx-auto mt-3 max-w-[450px] text-[13px] leading-6 text-[#302720]/45">
                Your next beauty moment is waiting for you. Explore our salons
                and make a new booking.
              </p>

              <Link
                to="/salons"
                className="mt-6 inline-flex h-[48px] items-center gap-3 rounded-[9px] bg-[#9a7444] px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#fffaf2] transition-colors hover:bg-[#76552f]"
              >
                Explore salons
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          ) : (
            <div className="grid overflow-hidden rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] lg:grid-cols-[0.7fr_1fr]">
              <div className="relative min-h-[260px]">
                <img
                  src={getSalonImage(nextAppointment)}
                  alt={getSalonName(nextAppointment)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="p-7 sm:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#dfcba9]/55 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#76552f]">
                    {getStatusLabel(nextAppointment)}
                  </span>

                  <span className="text-[10px] font-bold text-[#302720]/35">
                    {formatDate(nextAppointment.booking_date)}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-[34px] text-[#302720]">
                  {getSalonName(nextAppointment)}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-[12px] text-[#302720]/50">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {getSalonLocation(nextAppointment)}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[10px] bg-[#eee5d8] p-4">
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#302720]/35">
                      Service
                    </div>

                    <div className="mt-1 text-[12px] font-bold">
                      {getServiceName(nextAppointment)}
                    </div>
                  </div>

                  <div className="rounded-[10px] bg-[#eee5d8] p-4">
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#302720]/35">
                      Time
                    </div>

                    <div className="mt-1 text-[12px] font-bold">
                      {formatTime(nextAppointment.booking_time)}
                    </div>
                  </div>
                </div>

                <Link
                  to="/bookings"
                  className="mt-6 inline-flex h-[48px] items-center gap-3 rounded-[9px] border border-[#76552f]/25 bg-[#dfcba9]/55 px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#76552f] transition-colors hover:bg-[#dfcba9]"
                >
                  Manage booking
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* -------------------------------------------------- */}
        {/* FAVOURITES */}
        {/* -------------------------------------------------- */}

        <section className="mt-9 pb-16">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
                Your collection
              </div>

              <h2 className="mt-2 font-display text-[36px] text-[#302720]">
                Favourite salons
              </h2>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9] text-[#76552f]"
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Luna Beauty Lounge",
              "Glow Beauty Studio",
            ].map((name, index) => (
              <div
                key={name}
                className="flex items-center gap-4 rounded-[14px] border border-[#302720]/10 bg-[#f5eee4] p-4"
              >
                <img
                  src={
                    index === 0
                      ? "/images/salon-export.jpg"
                      : "/images/glow-space.jpg.jpg"
                  }
                  alt={name}
                  className="h-20 w-20 rounded-[10px] object-cover"
                />

                <div>
                  <h3 className="font-display text-[20px] text-[#302720]">
                    {name}
                  </h3>

                  <div className="mt-1 text-[10px] text-[#302720]/40">
                    Basra · Beauty salon
                  </div>

                  <Link
                    to="/salons"
                    className="mt-2 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#9a7444]"
                  >
                    View salon
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ClientDashboard;