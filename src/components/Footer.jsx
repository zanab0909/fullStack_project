import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faLocationDot,
  faPhone,
  faCalendarDays,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#302720] text-[#f5eee4]">
      <div className="mx-auto max-w-[1580px] px-5 sm:px-8 lg:px-12">
        {/* Main brand section */}
        <div className="border-b border-[#dfcba9]/20 py-14 sm:py-16 lg:py-20">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.32em] text-[#c5a477]">
                GLOW · Beauty Platform
              </p>

              <h2 className="mt-6 font-display text-[clamp(5rem,13vw,12rem)] font-semibold leading-[0.62] tracking-[-0.09em] text-[#f5eee4]">
                GLOW
              </h2>
            </div>

            <div className="max-w-[480px]">
              <p className="font-display text-[30px] font-medium leading-[1.08] text-[#f5eee4]/65 sm:text-[38px]">
                Beauty discovery,
                <br />
                <span className="italic text-[#dfcba9]">
                  beautifully connected.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA + links */}
        <div className="grid border-b border-[#dfcba9]/20 lg:grid-cols-12">
          {/* CTA */}
          <div className="border-b border-[#dfcba9]/20 py-12 sm:py-14 lg:col-span-7 lg:border-b-0 lg:border-r lg:py-16 lg:pr-16">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#c5a477]">
              Start your GLOW journey
            </p>

            <h3 className="mt-7 max-w-[800px] font-display text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[0.78] tracking-[-0.07em] text-[#f5eee4]">
              FIND A PLACE
              <br />
              <span className="italic text-[#dfcba9]">
                THAT FEELS LIKE YOU.
              </span>
            </h3>

            <Link
              to="/bookings"
              className="group mt-10 inline-flex h-[52px] items-center gap-4 rounded-[9px] border border-[#c5a477]/60 bg-[#c5a477] px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#302720] shadow-[0_10px_28px_rgba(197,164,119,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#dfcba9] hover:bg-[#dfcba9]"
            >
              <FontAwesomeIcon icon={faCalendarDays} />

              Begin your booking

              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[9px] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Explore */}
          <div className="border-b border-[#dfcba9]/20 p-7 sm:p-9 lg:col-span-2 lg:border-b-0 lg:p-10">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#c5a477]">
              Explore
            </p>

            <div className="mt-7 flex flex-col gap-4">
              <Link
                to="/"
                className="w-fit text-[13px] font-semibold text-[#f5eee4]/60 transition-colors hover:text-[#dfcba9]"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="w-fit text-[13px] font-semibold text-[#f5eee4]/60 transition-colors hover:text-[#dfcba9]"
              >
                About
              </Link>

              <Link
                to="/salons"
                className="w-fit text-[13px] font-semibold text-[#f5eee4]/60 transition-colors hover:text-[#dfcba9]"
              >
                Salons
              </Link>

              <Link
                to="/services"
                className="w-fit text-[13px] font-semibold text-[#f5eee4]/60 transition-colors hover:text-[#dfcba9]"
              >
                Services
              </Link>

              <Link
                to="/bookings"
                className="w-fit text-[13px] font-semibold text-[#f5eee4]/60 transition-colors hover:text-[#dfcba9]"
              >
                Bookings
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="p-7 sm:p-9 lg:col-span-3 lg:p-10">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#c5a477]">
              Contact
            </p>

            <div className="mt-7 space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfcba9]/10">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-[13px] text-[#dfcba9]"
                  />
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-[#f5eee4]/80">
                    Basra · Iraq
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#f5eee4]/35">
                    Beauty destinations across Basra
                  </p>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:07857804353"
                className="group flex items-center gap-4 text-[13px] font-semibold text-[#f5eee4]/65 transition-colors hover:text-[#dfcba9]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfcba9]/10">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-[12px] text-[#dfcba9]"
                  />
                </div>

                07857804353
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/9647857804353"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 text-[13px] font-semibold text-[#f5eee4]/65 transition-colors hover:text-[#dfcba9]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfcba9]/10">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="text-[16px] text-[#dfcba9]"
                  />
                </div>

                <span className="flex items-center gap-2">
                  WhatsApp

                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="text-[8px] opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="group flex items-center gap-4 text-[13px] font-semibold text-[#f5eee4]/65 transition-colors hover:text-[#dfcba9]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfcba9]/10">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="text-[16px] text-[#dfcba9]"
                  />
                </div>

                <span className="flex items-center gap-2">
                  Instagram

                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="text-[8px] opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col justify-between gap-6 py-7 sm:py-8 md:flex-row md:items-center">
          <div>
            <p className="text-[8px] font-extrabold uppercase tracking-[0.28em] text-[#f5eee4]/35">
              © 2026 GLOW
            </p>

            <p className="mt-2 text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#f5eee4]/20">
              Beauty · Art · Individuality
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="group flex h-[42px] items-center gap-3 self-start rounded-[8px] border border-[#dfcba9]/25 px-4 text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#f5eee4]/55 transition-all duration-300 hover:border-[#dfcba9]/60 hover:bg-[#dfcba9]/10 hover:text-[#dfcba9] md:self-auto"
          >
            Back to top

            <FontAwesomeIcon
              icon={faArrowUp}
              className="text-[9px] transition-transform duration-300 group-hover:-translate-y-1"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;