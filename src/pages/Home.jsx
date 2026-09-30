import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendarDays,
  faLocationDot,
  faMagnifyingGlass,
  faStar,
  faScissors,
  faCheck,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const Reveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) => {
  const directions = {
    up: { y: 45, x: 0 },
    left: { y: 0, x: -45 },
    right: { y: 0, x: 45 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const salons = [
  {
    name: "Luna Beauty Lounge",
    location: "Al Ashar, Basra",
    rating: "4.9",
    reviews: "128",
    service: "Hair & Makeup",
    image: "/images/glow-space.jpg.jpg",
    verified: true,
  },
  {
    name: "Glow Beauty Studio",
    location: "Al Jubaila, Basra",
    rating: "4.8",
    reviews: "96",
    service: "Beauty & Nails",
    image: "/images/glow-beauty.jpg",
    verified: true,
  },
  {
    name: "Velvet Beauty House",
    location: "Al Qibla, Basra",
    rating: "4.9",
    reviews: "84",
    service: "Makeup & Bridal",
    image: "/images/salon-export.jpg",
    verified: true,
  },
];

const services = [
  {
    title: "Hair",
    description: "Styling, treatments & transformations",
    image: "/images/glow-hair.jpg.jpg",
  },
  {
    title: "Makeup",
    description: "Everyday, event & bridal looks",
    image: "/images/makeup-export.jpg",
  },
  {
    title: "Nails",
    description: "Manicure, extensions & nail art",
    image: "/images/nail-export.jpg",
  },
  {
    title: "Beauty",
    description: "Brows, lashes & beauty care",
    image: "/images/glow-beauty.jpg",
  },
];

const Home = () => {
  useEffect(() => {
    document.title = "GLOW — Beauty Platform";
  }, []);

  return (
    <main className="overflow-hidden bg-[#eee5d8] text-[#302720]">
      <section className="relative px-3 pb-4 pt-4 sm:px-5 lg:px-7">
        <div className="relative mx-auto min-h-[680px] max-w-[1580px] overflow-hidden rounded-[24px] bg-[#302720] sm:min-h-[730px] lg:min-h-[780px]">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            src="/images/glow-hero.jpg.jpg"
            alt="GLOW Beauty Platform"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#17120f]/45" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#17120f]/90 via-[#17120f]/45 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#17120f]/75 via-transparent to-[#17120f]/20" />

          <div className="relative z-10 flex min-h-[680px] flex-col justify-between p-6 sm:min-h-[730px] sm:p-10 lg:min-h-[780px] lg:p-14">
            <div className="flex items-start justify-between">
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#dfcba9]" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                    Beauty Platform · Basra
                  </span>
                </div>
              </div>

              <div className="hidden rounded-[12px] border border-white/15 bg-white/10 px-5 py-3 text-right backdrop-blur-md sm:block">
                <p className="font-display text-2xl text-[#dfcba9]">
                  2026
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
                  Discover locally
                </p>
              </div>
            </div>

            <div className="max-w-[900px]">
              <Reveal direction="left">
                <p className="mb-5 text-[12px] font-extrabold uppercase tracking-[0.28em] text-[#dfcba9]">
                  Your beauty destination
                </p>

                <h1 className="font-display text-[clamp(4.5rem,12vw,11rem)] font-semibold leading-[0.76] tracking-[-0.075em] text-[#f5eee4]">
                  FIND YOUR
                  <br />
                  <span className="italic text-[#dfcba9]">
                    GLOW.
                  </span>
                </h1>

                <p className="mt-8 max-w-[620px] text-[17px] font-medium leading-8 text-white/75 sm:text-[19px]">
                  Discover salons, beauty experts and services across Basra.
                  Compare, choose and book your next beauty experience in one
                  place.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    to="/salons"
                    className="group flex min-h-[54px] items-center gap-4 rounded-[10px] bg-[#dfcba9] px-6 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#302720] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f5eee4]"
                  >
                    Explore Salons

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#302720] text-[#f5eee4] transition-transform duration-300 group-hover:translate-x-1">
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-[10px]"
                      />
                    </span>
                  </Link>

                  <Link
                    to="/bookings"
                    className="flex min-h-[54px] items-center gap-3 rounded-[10px] border border-white/25 bg-white/10 px-6 text-[12px] font-extrabold uppercase tracking-[0.1em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                  >
                    <FontAwesomeIcon icon={faCalendarDays} />
                    Book Now
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="hidden items-center justify-between border-t border-white/15 pt-5 md:flex">
              <div className="flex items-center gap-3 text-white/65">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-[#dfcba9]"
                />

                <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
                  Basra, Iraq
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                Discover · Choose · Book
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 py-14 sm:px-5 sm:py-20 lg:px-7">
        <div className="mx-auto max-w-[1580px]">
          <Reveal>
            <div className="rounded-[20px] border border-[#302720]/15 bg-[#f5eee4]/65 p-3 shadow-[0_18px_55px_rgba(48,39,32,0.08)] backdrop-blur-xl">
              <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr_0.8fr_auto]">
                <div className="flex min-h-[68px] items-center gap-4 rounded-[13px] border border-[#302720]/10 bg-[#eee5d8]/75 px-5">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-[#9a7444]"
                  />

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/45">
                      Search
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#302720]">
                      Salon, service or beauty expert
                    </p>
                  </div>
                </div>

                <div className="flex min-h-[68px] items-center gap-4 rounded-[13px] border border-[#302720]/10 bg-[#eee5d8]/75 px-5">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-[#9a7444]"
                  />

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/45">
                      Location
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#302720]">
                      Basra, Iraq
                    </p>
                  </div>
                </div>

                <div className="flex min-h-[68px] items-center gap-4 rounded-[13px] border border-[#302720]/10 bg-[#eee5d8]/75 px-5">
                  <FontAwesomeIcon
                    icon={faScissors}
                    className="text-[#9a7444]"
                  />

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/45">
                      Service
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#302720]">
                      All services
                    </p>
                  </div>
                </div>

                <Link
                  to="/salons"
                  className="flex min-h-[68px] items-center justify-center gap-3 rounded-[13px] border border-[#76552f]/30 bg-[#c5a477] px-7 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#302720] shadow-[0_8px_24px_rgba(118,85,47,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dfcba9] hover:shadow-[0_12px_30px_rgba(118,85,47,0.2)]"
                >
                  Search
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-3 pb-20 sm:px-5 lg:px-7 lg:pb-28">
        <div className="mx-auto max-w-[1580px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#9a7444]">
                  Curated for you
                </p>

                <h2 className="mt-4 font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.85] tracking-[-0.055em]">
                  Featured Salons
                </h2>
              </div>

              <Link
                to="/salons"
                className="group flex w-fit items-center gap-3 border-b border-[#302720]/25 pb-2 text-[12px] font-extrabold uppercase tracking-[0.1em] transition-colors hover:border-[#9a7444] hover:text-[#76552f]"
              >
                View all salons

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {salons.map((salon, index) => (
              <Reveal key={salon.name} delay={index * 0.1}>
                <Link
                  to="/salons"
                  className="group block overflow-hidden rounded-[17px] border border-[#302720]/12 bg-[#f5eee4] shadow-[0_10px_35px_rgba(48,39,32,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(48,39,32,0.13)]"
                >
                  <div className="relative m-2 overflow-hidden rounded-[12px] bg-[#d9cbb8] p-1.5">
                    <div className="relative overflow-hidden rounded-[8px]">
                      <img
                        src={salon.image}
                        alt={salon.name}
                        className="h-[330px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />

                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-[#302720]/70 px-3 py-2 text-[10px] font-bold text-white backdrop-blur-md">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-[#dfcba9]"
                        />
                        {salon.rating}
                      </div>

                      <button
                        type="button"
                        onClick={(event) => event.preventDefault()}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#302720]/55 text-white backdrop-blur-md transition-colors hover:bg-[#302720]/80"
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className="text-[13px]"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-[27px] font-semibold leading-none tracking-[-0.025em]">
                            {salon.name}
                          </h3>

                          {salon.verified && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#61745b] text-white">
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="text-[8px]"
                              />
                            </span>
                          )}
                        </div>

                        <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#302720]/55">
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className="text-[#9a7444]"
                          />
                          {salon.location}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#e9dcc8] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#76552f]">
                        Verified
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#302720]/10 pt-5">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/40">
                          Specialties
                        </p>

                        <p className="mt-1 text-[13px] font-bold">
                          {salon.service}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/40">
                          Reviews
                        </p>

                        <p className="mt-1 text-[13px] font-bold">
                          {salon.reviews}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#302720]/10 pt-5 text-[11px] font-extrabold uppercase tracking-[0.1em]">
                      <span className="text-[#302720]/55">
                        View salon
                      </span>

                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-[#9a7444] transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#302720]/12 bg-[#dfcdb7] px-3 py-20 sm:px-5 lg:px-7 lg:py-28">
        <div className="mx-auto max-w-[1580px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#76552f]">
                  Explore by category
                </p>

                <h2 className="mt-4 font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.85] tracking-[-0.055em]">
                  What are you
                  <br />
                  <span className="italic text-[#9a7444]">
                    looking for?
                  </span>
                </h2>
              </div>

              <p className="max-w-[430px] text-[15px] font-semibold leading-7 text-[#302720]/60">
                From hair and makeup to nails, brows and complete beauty
                experiences, discover services from salons across the city.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.08}>
                <Link
                  to="/services"
                  className="group relative block overflow-hidden rounded-[15px] border border-[#302720]/15 bg-[#302720]"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-[330px] w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-65"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#17120f] via-[#17120f]/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-[#f5eee4]">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#dfcba9]">
                      0{index + 1}
                    </p>

                    <h3 className="mt-2 font-display text-4xl font-semibold">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-[13px] font-medium leading-5 text-white/65">
                      {service.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.12em]">
                        Explore
                      </span>

                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-20 sm:px-5 lg:px-7 lg:py-28">
        <div className="mx-auto max-w-[1580px]">
          <Reveal>
            <div className="text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#9a7444]">
                Simple by design
              </p>

              <h2 className="mt-4 font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.85] tracking-[-0.055em]">
                Your beauty journey,
                <br />
                <span className="italic text-[#9a7444]">
                  simplified.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Discover",
                text: "Browse salons, specialists and services that match what you are looking for.",
                icon: faMagnifyingGlass,
              },
              {
                number: "02",
                title: "Choose",
                text: "Compare ratings, reviews, services and details before making your choice.",
                icon: faStar,
              },
              {
                number: "03",
                title: "Book",
                text: "Select your service and preferred time, then manage everything from one place.",
                icon: faCalendarDays,
              },
            ].map((item, index) => (
              <Reveal key={item.number} delay={index * 0.1}>
                <div className="h-full rounded-[16px] border border-[#302720]/12 bg-[#f5eee4] p-7 shadow-[0_8px_30px_rgba(48,39,32,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-semibold text-[#9a7444]">
                      {item.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9dcc8] text-[#76552f]">
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                  </div>

                  <h3 className="mt-9 font-display text-4xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-[14px] font-semibold leading-7 text-[#302720]/58">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-4 sm:px-5 lg:px-7">
        <div className="relative mx-auto max-w-[1580px] overflow-hidden rounded-[22px] bg-[#302720] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="absolute right-[-100px] top-[-150px] h-[400px] w-[400px] rounded-full bg-[#9a7444]/20 blur-[90px]" />

          <div className="relative z-10 flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#dfcba9]">
                Ready when you are
              </p>

              <h2 className="mt-5 max-w-[850px] font-display text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-[#f5eee4]">
                Your next beauty
                <br />
                <span className="italic text-[#dfcba9]">
                  experience starts here.
                </span>
              </h2>

              <p className="mt-7 max-w-[560px] text-[15px] font-medium leading-7 text-white/60">
                Find a salon, choose your service and book your next
                appointment with GLOW.
              </p>
            </div>

            <Link
              to="/salons"
              className="group flex min-h-[58px] w-fit shrink-0 items-center gap-4 rounded-[10px] bg-[#dfcba9] px-7 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#302720] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f5eee4]"
            >
              Explore GLOW

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#302720] text-[#f5eee4] transition-transform duration-300 group-hover:translate-x-1">
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[10px]"
                />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-3 py-10 sm:px-5 lg:px-7">
        <div className="mx-auto max-w-[1580px] overflow-hidden rounded-[14px] border border-[#302720]/10 bg-[#e1d1ba] py-5">
          <motion.div
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max items-center gap-14"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-14"
              >
                <span className="font-display text-3xl font-semibold italic text-[#302720] sm:text-4xl">
                  DISCOVER BEAUTY
                </span>

                <span className="h-2 w-2 rounded-full bg-[#9a7444]" />

                <span className="font-display text-3xl font-semibold text-[#302720] sm:text-4xl">
                  FIND YOUR GLOW
                </span>

                <span className="h-2 w-2 rounded-full bg-[#9a7444]" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;