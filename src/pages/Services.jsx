import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowDown,
  faScissors,
  faBrush,
  faHandSparkles,
  faSpa,
  faWandMagicSparkles,
  faEye,
  faPerson,
  faComments,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const services = [
  {
    number: "01",
    title: "Makeup",
    subtitle: "Makeup artistry for every occasion.",
    icon: faBrush,
    image: "/images/makeup-export.jpg",
    items: [
      "Bridal Makeup",
      "Soft Glam",
      "Full Glam",
      "Henna Makeup",
      "Engagement Makeup",
      "Evening Makeup",
    ],
  },
  {
    number: "02",
    title: "Hair",
    subtitle: "Hair styling, treatments and transformations.",
    icon: faScissors,
    image: "/images/hair-export.jpg",
    items: [
      "Hair Styling",
      "Hair Cutting",
      "Hair Coloring",
      "Hair Treatment",
      "Blow Dry",
      "Bridal Hair",
    ],
  },
  {
    number: "03",
    title: "Nails",
    subtitle: "Details that complete your look.",
    icon: faHandSparkles,
    image: "/images/nails-export.jpg",
    items: [
      "Manicure",
      "Pedicure",
      "Gel Nails",
      "Acrylic Nails",
      "Nail Art",
      "French Nails",
    ],
  },
  {
    number: "04",
    title: "Beauty",
    subtitle: "Personal care designed around you.",
    icon: faWandMagicSparkles,
    image: "/images/glow-beauty.jpg",
    items: [
      "Facials",
      "Skin Care",
      "Body Care",
      "Beauty Treatments",
      "Deep Cleansing",
      "Special Care",
    ],
  },
  {
    number: "05",
    title: "Brows & Lashes",
    subtitle: "Frame your face with precision.",
    icon: faEye,
    image: "/images/image5.jpg",
    items: [
      "Eyebrow Shaping",
      "Eyebrow Tint",
      "Lash Lifting",
      "Lash Extensions",
      "Lash Tint",
      "Brow Lamination",
    ],
  },
  {
    number: "06",
    title: "Massage",
    subtitle: "Slow down. Relax. Reset.",
    icon: faSpa,
    image: "/images/glow-space.jpg.jpg",
    items: [
      "Relaxation Massage",
      "Full Body Massage",
      "Head Massage",
      "Back Massage",
      "Foot Massage",
      "Special Massage",
    ],
  },
  {
    number: "07",
    title: "Comprehensive Care",
    subtitle: "Complete beauty experiences in one visit.",
    icon: faPerson,
    image: "/images/salon-export.jpg",
    items: [
      "Full Beauty Package",
      "Bridal Package",
      "Hair & Makeup",
      "Beauty Day",
      "Complete Care",
      "Custom Package",
    ],
  },
  {
    number: "08",
    title: "Free Consultation",
    subtitle: "Not sure what you need? Start here.",
    icon: faComments,
    image: "/images/glow-space.jpg.jpg",
    items: [
      "Beauty Consultation",
      "Hair Consultation",
      "Makeup Consultation",
      "Bridal Consultation",
      "Skin Consultation",
      "Personal Recommendation",
    ],
  },
];

const Services = () => {
  const [openService, setOpenService] = useState(null);

  useEffect(() => {
    document.title = "Services — GLOW";
  }, []);

  const createServiceLink = (service) => {
    const serviceSlug = service
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-");

    return `/bookings?service=${encodeURIComponent(serviceSlug)}`;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e6] text-[#302720]">
      <section className="border-b border-[#302720]/15 px-5 pb-20 pt-36 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1700px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.45fr] lg:items-end">
            <div>
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-12 bg-[#8a6a43]" />

                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#8a6a43]">
                  GLOW · Beauty Services
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="font-display text-[17vw] font-semibold leading-[0.78] tracking-[-0.075em] sm:text-[14vw] lg:text-[10vw]"
              >
                SERVICES
              </motion.h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-[#302720]/65 sm:text-lg">
                Explore beauty services from trusted salons across
                Basra. Choose what you need, discover the right
                specialist and continue to your appointment.
              </p>
            </div>

            <div className="lg:text-right">
              <span className="font-display text-7xl font-semibold text-[#8a6a43]">
                08
              </span>

              <p className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#302720]/45">
                Beauty categories
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#302720]/15 px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex max-w-[1700px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="font-display text-sm text-[#8a6a43]">
              01
            </span>

            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]">
              Explore a category
            </p>
          </div>

          <p className="max-w-xl text-xs leading-5 text-[#302720]/50 sm:text-right">
            Tap a category to reveal available services, then choose
            the exact treatment you want.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1700px]">
          <div className="grid border-t border-[#302720]/15 md:grid-cols-2">
            {services.map((service, index) => {
              const isOpen = openService === index;

              return (
                <motion.article
                  key={service.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.04,
                  }}
                  className={`group border-b border-[#302720]/15 p-4 sm:p-6 ${
                    index % 2 === 0
                      ? "md:border-r md:border-[#302720]/15"
                      : ""
                  }`}
                >
                  <div className="bg-[#e9dcc8]/45 p-2">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center bg-[#f7f1e6]">
                        <FontAwesomeIcon
                          icon={service.icon}
                          className="text-sm text-[#8a6a43]"
                        />
                      </div>

                      <div className="absolute bottom-4 left-4 bg-[#302720] px-3 py-2 text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#f7f1e6]">
                        {service.number}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenService(isOpen ? null : index)
                    }
                    className="mt-5 w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                          {service.title}
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-[#302720]/55">
                          {service.subtitle}
                        </p>
                      </div>

                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center border transition duration-300 ${
                          isOpen
                            ? "border-[#302720] bg-[#302720] text-[#f7f1e6]"
                            : "border-[#302720]/20 bg-[#f7f1e6] text-[#302720] group-hover:border-[#8a6a43] group-hover:text-[#8a6a43]"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={isOpen ? faMinus : faPlus}
                          className="text-xs"
                        />
                      </span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 border-t border-[#302720]/10 pt-3">
                          {service.items.map((item, itemIndex) => (
                            <Link
                              key={item}
                              to={createServiceLink(item)}
                              className="group/service flex items-center justify-between border-b border-[#302720]/10 py-4 transition hover:px-2"
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-display text-xs text-[#8a6a43]">
                                  {String(itemIndex + 1).padStart(2, "0")}
                                </span>

                                <span className="text-sm font-semibold">
                                  {item}
                                </span>
                              </div>

                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-xs text-[#8a6a43] opacity-0 transition duration-300 group-hover/service:translate-x-1 group-hover/service:opacity-100"
                              />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#302720]/15 bg-[#e9dcc8]/35 px-5 py-20 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1700px]">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr]">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#8a6a43]">
                02 · Simple by design
              </span>

              <h2 className="mt-4 max-w-lg font-display text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-6xl">
                From service
                <br />
                to appointment.
              </h2>
            </div>

            <div className="border-t border-[#302720]/15">
              {[
                {
                  number: "01",
                  title: "Choose a service",
                  text: "Find the beauty treatment that matches what you need.",
                },
                {
                  number: "02",
                  title: "Explore salons",
                  text: "Compare salons, specialists, ratings and available services.",
                },
                {
                  number: "03",
                  title: "Pick your time",
                  text: "Choose an available date and time that works for you.",
                },
                {
                  number: "04",
                  title: "Book with confidence",
                  text: "Confirm your appointment and manage it from your account.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="grid gap-4 border-b border-[#302720]/15 py-6 sm:grid-cols-[60px_0.7fr_1fr]"
                >
                  <span className="font-display text-sm text-[#8a6a43]">
                    {step.number}
                  </span>

                  <h3 className="font-display text-2xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-6 text-[#302720]/55">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#302720] px-5 py-20 text-[#f7f1e6] sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex max-w-[1700px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#dfcba9]">
              Your next appointment
            </span>

            <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-7xl">
              Find the service
              <br />
              that feels like you.
            </h2>
          </div>

          <Link
            to="/bookings"
            className="group flex w-fit items-center gap-5 rounded-[8px] border border-[#dfcba9] bg-[#dfcba9] px-7 py-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#302720] shadow-[0_12px_30px_rgba(223,203,169,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#f0dfbd] hover:bg-[#f0dfbd] hover:shadow-[0_16px_38px_rgba(223,203,169,0.24)]"
          >
            Start Booking

            <FontAwesomeIcon
              icon={faArrowRight}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Services;