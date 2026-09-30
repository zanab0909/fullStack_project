import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowDown,
  faLocationDot,
  faCalendarDays,
  faMagnifyingGlass,
  faScissors,
  faHeart,
  faStar,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

const Reveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const directions = {
    up: { y: 60, x: 0 },
    left: { y: 0, x: -60 },
    right: { y: 0, x: 60 },
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
        amount: 0.15,
      }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "16%"]
  );

  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "28%"]
  );

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, 0]
  );

  useEffect(() => {
    document.title = "About GLOW — Beauty Platform";
  }, []);

  const steps = [
    {
      number: "01",
      icon: faMagnifyingGlass,
      title: "Discover",
      text: "Explore beauty salons, studios and specialists gathered in one destination.",
    },
    {
      number: "02",
      icon: faLocationDot,
      title: "Choose",
      text: "Compare locations, services and experiences to find the place that fits you.",
    },
    {
      number: "03",
      icon: faScissors,
      title: "Select",
      text: "Browse the services you want and discover the people behind them.",
    },
    {
      number: "04",
      icon: faCalendarDays,
      title: "Book",
      text: "Choose your preferred time and reserve your beauty experience.",
    },
  ];

  return (
    <main className="overflow-hidden bg-[#201914] text-[#eee5d8]">
      <section
        ref={heroRef}
        className="relative min-h-[92vh] overflow-hidden border-b border-white/10 bg-[#17120f]"
      >
        <motion.img
          style={{ y: imageY }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          src="/images/glow-space.jpg.jpg"
          alt="GLOW Beauty Platform"
          className="absolute inset-[-8%] h-[116%] w-full object-cover"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-[#17120f]/62"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#17120f] via-[#17120f]/20 to-[#17120f]/45" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex min-h-[92vh] flex-col justify-between px-5 pb-10 pt-36 md:px-10 md:pb-14 lg:px-16"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto flex w-full max-w-[1750px] items-start justify-between"
          >
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#f5eee4]">
                About GLOW
              </p>

              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfcba9]">
                The Beauty Platform
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="font-display text-3xl text-[#eee5d8]">
                001
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/55">
                Our Story
              </p>
            </div>
          </motion.div>

          <div className="mx-auto w-full max-w-[1750px]">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 74, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.55,
              }}
              className="mb-7 h-px bg-[#dfcba9]"
            />

            <motion.p
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.65,
              }}
              className="mb-7 text-[10px] font-extrabold uppercase tracking-[0.34em] text-[#dfcba9]"
            >
              Beauty · Community · Choice
            </motion.p>

            <motion.h1
              style={{ y: titleY }}
              initial={{
                opacity: 0,
                y: 80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.1,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-[clamp(5rem,15vw,16rem)] font-semibold leading-[0.63] tracking-[-0.1em] text-[#f5eee4]"
            >
              ABOUT
            </motion.h1>

            <div className="mt-10 grid gap-8 border-t border-white/20 pt-7 md:grid-cols-12 md:items-end">
              <Reveal
                direction="left"
                className="md:col-span-8"
              >
                <p className="max-w-4xl font-serif text-3xl font-medium leading-[1.03] text-white/88 md:text-4xl lg:text-5xl">
                  Beauty discovery should feel
                  <br />
                  <span className="italic text-[#dfcba9]">
                    effortless, personal and inspiring.
                  </span>
                </p>
              </Reveal>

              <Reveal
                direction="right"
                delay={0.15}
                className="md:col-span-4 md:flex md:justify-end"
              >
                <div className="flex items-center gap-3 text-white/55">
                  <motion.span
                    animate={{ y: [0, 7, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowDown} />
                  </motion.span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    Explore our story
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-b border-white/10 bg-[#eee5d8] px-5 py-24 text-[#302720] md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1750px]">
          <div className="grid gap-14 lg:grid-cols-12">
            <Reveal
              direction="left"
              className="lg:col-span-3"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#76552f]">
                01 — The Idea
              </p>

              <div className="mt-9 border-t border-[#302720]/15 pt-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-[#302720] shadow-[0_12px_30px_rgba(48,39,32,0.16)]">
                  <span className="font-display text-3xl text-[#eee5d8]">
                    G
                  </span>
                </div>

                <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#302720]/45">
                  Beauty Platform
                </p>
              </div>

              <div className="mt-10 flex items-center gap-3 text-[#302720]/45">
                <FontAwesomeIcon icon={faStar} className="text-[#9a7444]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Discover differently
                </span>
              </div>
            </Reveal>

            <Reveal
              direction="right"
              delay={0.1}
              className="lg:col-span-9"
            >
              <h2 className="font-display text-[clamp(3.7rem,8vw,9.2rem)] font-semibold leading-[0.69] tracking-[-0.08em]">
                BEAUTY
                <br />
                <span className="ml-[7%] italic text-[#9a7444]">
                  SHOULD BE EASY.
                </span>
              </h2>

              <div className="mt-14 grid gap-10 md:grid-cols-2">
                <p className="font-serif text-3xl font-medium leading-[1.05] md:text-4xl">
                  GLOW was created around one simple idea:
                  <span className="italic">
                    finding your beauty place should be part of the experience.
                  </span>
                </p>

                <div>
                  <p className="text-[15px] font-semibold leading-8 text-[#302720]/68 md:text-base">
                    Beauty is personal. The right salon, artist or service
                    can completely change how you feel. GLOW brings those
                    choices together in one carefully designed platform.
                  </p>

                  <p className="mt-6 text-[15px] font-semibold leading-8 text-[#302720]/68 md:text-base">
                    Instead of moving between social accounts, messages and
                    scattered information, users can discover salons, explore
                    services and make appointments from one place.
                  </p>

                  <Link
                    to="/salons"
                    className="group mt-9 inline-flex items-center gap-4 rounded-[8px] border border-[#302720]/15 bg-[#f5eee4] px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.18em] shadow-[0_8px_25px_rgba(48,39,32,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9a7444]/40 hover:shadow-[0_15px_35px_rgba(48,39,32,0.11)]"
                  >
                    Explore salons

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9a7444] text-[#fffaf2] transition-transform duration-300 group-hover:translate-x-1">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#302720] px-5 py-24 text-[#eee5d8] md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1750px]">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <Reveal
              direction="left"
              className="lg:col-span-8"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.34em] text-[#dfcba9]">
                02 — What We Believe
              </p>

              <h2 className="mt-9 font-display text-[clamp(4rem,8.5vw,9.5rem)] font-semibold leading-[0.67] tracking-[-0.08em]">
                ONE PLACE.
                <br />
                <span className="italic text-[#dfcba9]">
                  MORE CHOICE.
                </span>
              </h2>
            </Reveal>

            <Reveal
              direction="right"
              delay={0.15}
              className="lg:col-span-4"
            >
              <p className="font-serif text-2xl font-medium leading-[1.1] text-white/72 md:text-3xl">
                A platform designed around the freedom to discover what feels
                right for you.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Choice",
                text: "Different people want different experiences. GLOW keeps the choice in your hands.",
              },
              {
                number: "02",
                title: "Connection",
                text: "We connect clients with salons, specialists and services through one shared destination.",
              },
              {
                number: "03",
                title: "Discovery",
                text: "Great beauty experiences can be found beyond the accounts you already know.",
              },
            ].map((item, index) => (
              <motion.article
                key={item.number}
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -7,
                }}
                className="rounded-[14px] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-[#dfcba9]">
                    {item.number}
                  </span>

                  <div className="h-2 w-2 rounded-full bg-[#dfcba9]" />
                </div>

                <h3 className="mt-16 font-display text-4xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm font-semibold leading-7 text-white/55">
                  {item.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#302720]/15 bg-[#e4d8c7] px-5 py-24 text-[#302720] md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1750px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#76552f]">
                  03 — The Experience
                </p>

                <h2 className="mt-9 font-display text-[clamp(4rem,8.5vw,9.5rem)] font-semibold leading-[0.67] tracking-[-0.08em]">
                  HOW GLOW
                  <br />
                  <span className="italic text-[#9a7444]">
                    WORKS.
                  </span>
                </h2>
              </div>

              <p className="max-w-md font-serif text-2xl font-medium leading-[1.08] md:text-3xl">
                From the first search to the final appointment, everything
                starts in one place.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 overflow-hidden rounded-[14px] border border-[#302720]/15 bg-[#eee5d8] shadow-[0_20px_50px_rgba(48,39,32,0.08)]">
            <div className="grid md:grid-cols-4">
              {steps.map((step, index) => (
                <Reveal
                  key={step.number}
                  delay={index * 0.08}
                  className="border-b border-[#302720]/12 p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-4xl font-semibold">
                      {step.number}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#302720] text-[#dfcba9]">
                      <FontAwesomeIcon icon={step.icon} />
                    </div>
                  </div>

                  <h3 className="mt-16 font-display text-4xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm font-semibold leading-7 text-[#302720]/58">
                    {step.text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#17120f] px-5 py-24 text-[#eee5d8] md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1750px]">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <Reveal
              direction="left"
              className="lg:col-span-7"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.34em] text-[#dfcba9]">
                04 — Where It Begins
              </p>

              <h2 className="mt-10 font-display text-[clamp(4rem,9vw,11rem)] font-semibold leading-[0.65] tracking-[-0.09em]">
                MADE FOR
                <br />
                <span className="italic text-[#dfcba9]">
                  BASRA.
                </span>
              </h2>

              <p className="mt-11 max-w-2xl font-serif text-3xl font-medium leading-[1.05] text-white/72 md:text-4xl">
                GLOW begins in Basra — connecting the city’s beauty
                destinations and making them easier to discover.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-5 py-3">
                  <FontAwesomeIcon
                    icon={faStore}
                    className="text-[#dfcba9]"
                  />

                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/65">
                    Local salons
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-5 py-3">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-[#dfcba9]"
                  />

                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/65">
                    Personal choice
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal
              direction="right"
              delay={0.15}
              className="lg:col-span-5"
            >
              <motion.div
                whileHover={{
                  rotate: -1,
                  scale: 1.015,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="rounded-[8px] border border-[#dfcba9]/35 p-3"
              >
                <div className="relative overflow-hidden rounded-[4px] border border-[#dfcba9]/15">
                  <motion.img
                    whileHover={{
                      scale: 1.045,
                    }}
                    transition={{
                      duration: 0.9,
                    }}
                    src="/images/salon-export.jpg"
                    alt="Beauty salon in Basra"
                    className="h-[540px] w-full object-cover"
                  />

                  <div className="absolute bottom-5 left-5 right-5 rounded-[8px] border border-white/15 bg-[#17120f]/82 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9] text-[#302720]">
                          <FontAwesomeIcon icon={faLocationDot} />
                        </div>

                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em]">
                            Basra · Iraq
                          </p>

                          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                            Where GLOW begins
                          </p>
                        </div>
                      </div>

                      <span className="font-display text-2xl text-[#dfcba9]">
                        01
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-[#302720]/15 bg-[#eee5d8] px-5 py-24 text-[#302720] md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1750px]">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#76552f]">
                  05 — The Vision
                </p>

                <div className="mt-9 border-t border-[#302720]/15 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#302720] text-[#dfcba9]">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>

                  <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#302720]/55">
                    Beauty · Community · Choice
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8">
                <h2 className="font-display text-[clamp(3.8rem,8vw,8.5rem)] font-semibold leading-[0.68] tracking-[-0.08em]">
                  ONE CITY.
                  <br />
                  <span className="italic text-[#9a7444]">
                    MANY BEAUTIES.
                  </span>
                </h2>

                <p className="mt-12 max-w-4xl font-serif text-3xl font-medium leading-[1.05] md:text-4xl">
                  GLOW is designed to make beauty discovery more connected,
                  transparent and enjoyable — giving people more ways to
                  discover, compare and choose.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[10px] border border-[#302720]/12 bg-[#f5eee4] p-5">
                    <p className="font-display text-3xl">01</p>
                    <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#302720]/55">
                      Discover
                    </p>
                  </div>

                  <div className="rounded-[10px] border border-[#302720]/12 bg-[#f5eee4] p-5">
                    <p className="font-display text-3xl">02</p>
                    <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#302720]/55">
                      Connect
                    </p>
                  </div>

                  <div className="rounded-[10px] border border-[#302720]/12 bg-[#f5eee4] p-5">
                    <p className="font-display text-3xl">03</p>
                    <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#302720]/55">
                      Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-[#302720]/15 bg-[#d9c5a6] px-5 py-24 text-[#302720] md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1750px]">
          <Reveal>
            <div className="rounded-[14px] border border-[#302720]/20 bg-[#eadfce]/55 p-6 shadow-[0_20px_55px_rgba(48,39,32,0.08)] md:p-10">
              <div className="border-y-2 border-[#302720] py-11 md:py-14">
                <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#76552f]">
                      06 — Your next chapter
                    </p>

                    <h2 className="mt-8 font-display text-[clamp(3.8rem,8.5vw,9rem)] font-semibold leading-[0.65] tracking-[-0.08em]">
                      FIND YOUR
                      <br />
                      <span className="italic">
                        GLOW.
                      </span>
                    </h2>
                  </div>

                  <Link
                    to="/bookings"
                    className="group flex w-fit items-center gap-4 rounded-[8px] bg-[#9a7444] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fffaf2] shadow-[0_10px_25px_rgba(118,85,47,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#76552f] hover:shadow-[0_15px_35px_rgba(118,85,47,0.25)]"
                  >
                    <FontAwesomeIcon icon={faCalendarDays} />

                    Begin your booking

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden border-t border-white/10 bg-[#302720] py-7">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max items-center gap-16"
        >
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center gap-16"
            >
              <span className="font-display text-4xl font-semibold italic text-[#f5eee4] md:text-6xl">
                THE BEAUTY PLATFORM
              </span>

              <span className="font-display text-4xl font-semibold text-[#dfcba9] md:text-6xl">
                GLOW
              </span>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};

export default About;