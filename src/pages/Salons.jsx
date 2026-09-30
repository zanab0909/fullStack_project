import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faLocationDot,
  faMagnifyingGlass,
  faSliders,
  faStar,
  faXmark,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { apiCall } from "../api";

const fallbackImages = [
  "/images/salon-export.jpg",
  "/images/glow-space.jpg.jpg",
  "/images/glow-beauty.jpg",
];

const fallbackServices = [
  ["Makeup", "Hair", "Bridal"],
  ["Hair", "Makeup", "Beauty"],
  ["Nails", "Brows", "Massage"],
];

const areas = ["All areas", "Al Ashar", "Al Jubaila", "Al Qibla"];

const serviceFilters = [
  "All services",
  "Makeup",
  "Hair",
  "Nails",
  "Beauty",
  "Bridal",
  "Massage",
];

function Salons() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All areas");
  const [service, setService] = useState("All services");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSalons = async () => {
      try {
        const result = await apiCall("/salons");

        if (!mounted) return;

        const backendSalons = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        const formattedSalons = backendSalons.map((salon, index) => {
          const address =
            salon.address ||
            salon.location ||
            "Basra · Iraq";

          const salonServices =
            Array.isArray(salon.services) && salon.services.length > 0
              ? salon.services.map((item) =>
                  typeof item === "string"
                    ? item
                    : item.name || "Beauty"
                )
              : fallbackServices[index % fallbackServices.length];

          return {
            id: salon.id,
            slug:
              salon.slug ||
              String(salon.name || `salon-${salon.id}`)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
            name: salon.name || "GLOW Salon",
            location: address,
            area:
              salon.area ||
              (address.includes("·")
                ? address.split("·")[0].trim()
                : address),
            image:
              salon.image ||
              salon.image_url ||
              fallbackImages[index % fallbackImages.length],
            rating: salon.rating || "4.8",
            reviews: salon.reviews || 0,
            description:
              salon.description ||
              "A beautiful destination for your next beauty experience with GLOW.",
            services: salonServices,
            featured: salon.featured || false,
          };
        });

        setSalons(formattedSalons);
      } catch (error) {
        console.error("Failed to load salons:", error);
        setSalons([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSalons();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredSalons = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return salons.filter((salon) => {
      const matchesSearch =
        !normalizedSearch ||
        salon.name.toLowerCase().includes(normalizedSearch) ||
        salon.location.toLowerCase().includes(normalizedSearch) ||
        salon.services.some((item) =>
          item.toLowerCase().includes(normalizedSearch)
        );

      const matchesArea =
        area === "All areas" ||
        salon.area.toLowerCase().includes(area.toLowerCase());

      const matchesService =
        service === "All services" ||
        salon.services.some(
          (item) => item.toLowerCase() === service.toLowerCase()
        );

      return matchesSearch && matchesArea && matchesService;
    });
  }, [salons, search, area, service]);

  const clearFilters = () => {
    setSearch("");
    setArea("All areas");
    setService("All services");
  };

  return (
    <main className="glow-page">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#302720] text-[#f5eee4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(197,164,119,0.18),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(154,116,68,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-[1580px] px-5 pb-14 pt-14 sm:px-8 lg:px-12 lg:pb-20 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[850px]"
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#dfcba9]/20 bg-[#f5eee4]/7 px-4 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dfcba9]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#dfcba9]">
                Explore GLOW
              </span>
            </div>

            <h1 className="font-display text-[50px] font-medium leading-[0.96] tracking-[-0.055em] sm:text-[68px] lg:text-[82px]">
              Find your
              <span className="block text-[#dfcba9]">
                beauty space.
              </span>
            </h1>

            <p className="mt-7 max-w-[680px] text-[15px] leading-8 text-[#f5eee4]/60 sm:text-[17px]">
              Discover beauty salons across Basra, compare their atmosphere
              and services, then choose the place that feels right for you.
            </p>
          </motion.div>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.7,
            }}
            className="mt-10"
          >
            <div className="rounded-[15px] border border-[#f5eee4]/10 bg-[#f5eee4]/7 p-2 backdrop-blur-xl">
              <div className="grid gap-2 lg:grid-cols-[1.5fr_0.7fr_0.7fr_auto]">
                <div className="flex min-h-[56px] items-center gap-3 rounded-[10px] bg-[#f5eee4]/8 px-4">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-[13px] text-[#dfcba9]"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search salons, services..."
                    className="w-full bg-transparent text-[13px] font-semibold text-[#f5eee4] outline-none placeholder:text-[#f5eee4]/35"
                  />
                </div>

                <select
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className="min-h-[56px] rounded-[10px] bg-[#f5eee4]/8 px-4 text-[12px] font-bold text-[#f5eee4] outline-none"
                >
                  {areas.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#302720] text-[#f5eee4]"
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="min-h-[56px] rounded-[10px] bg-[#f5eee4]/8 px-4 text-[12px] font-bold text-[#f5eee4] outline-none"
                >
                  {serviceFilters.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#302720] text-[#f5eee4]"
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex min-h-[56px] items-center justify-center gap-2 rounded-[10px] border border-[#76552f]/30 bg-[#c5a477] px-6 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#302720] transition-all duration-300 hover:bg-[#dfcba9]"
                >
                  <FontAwesomeIcon
                    icon={showFilters ? faXmark : faSliders}
                    className="text-[11px]"
                  />

                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="mt-2 rounded-[10px] border border-[#f5eee4]/8 bg-[#f5eee4]/5 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#f5eee4]/35">
                      Quick areas
                    </span>

                    {areas.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setArea(item)}
                        className={`rounded-full border px-4 py-2 text-[10px] font-bold transition-all ${
                          area === item
                            ? "border-[#dfcba9] bg-[#dfcba9] text-[#302720]"
                            : "border-[#f5eee4]/10 text-[#f5eee4]/55 hover:border-[#dfcba9]/40 hover:text-[#f5eee4]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-auto text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#dfcba9] transition-colors hover:text-[#f5eee4]"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SALONS */}
      <section className="mx-auto max-w-[1580px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9a7444]">
              GLOW DIRECTORY
            </div>

            <h2 className="mt-2 font-display text-[36px] tracking-[-0.045em] text-[#302720] sm:text-[46px]">
              Beauty spaces in Basra
            </h2>
          </div>

          <div className="text-[12px] font-bold text-[#302720]/45">
            {loading
              ? "Loading salons..."
              : `${filteredSalons.length} ${
                  filteredSalons.length === 1 ? "salon" : "salons"
                } available`}
          </div>
        </div>

        {loading ? (
          <div className="rounded-[15px] border border-[#302720]/12 bg-[#f5eee4] px-6 py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#302720]/10 border-t-[#9a7444]" />

            <p className="mt-5 text-[12px] font-bold text-[#302720]/45">
              Loading beauty spaces...
            </p>
          </div>
        ) : filteredSalons.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredSalons.map((salon, index) => (
              <motion.article
                key={salon.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group overflow-hidden rounded-[15px] border border-[#302720]/12 bg-[#f5eee4] shadow-[0_8px_25px_rgba(48,39,32,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[#302720]/20 hover:shadow-[0_22px_55px_rgba(48,39,32,0.12)]"
              >
                <div className="relative h-[310px] overflow-hidden">
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#17120f]/75 via-transparent to-[#17120f]/10" />

                  {salon.featured && (
                    <div className="absolute left-4 top-4 rounded-full border border-[#f5eee4]/15 bg-[#302720]/65 px-3 py-2 backdrop-blur-md">
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#dfcba9]">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#f5eee4]/90 px-3 py-2 text-[#302720]">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-[9px] text-[#9a7444]"
                    />

                    <span className="text-[10px] font-extrabold">
                      {salon.rating}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#f5eee4]/65">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-[#dfcba9]"
                      />

                      {salon.location}
                    </div>

                    <h3 className="mt-2 font-display text-[30px] leading-tight text-[#f5eee4]">
                      {salon.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {salon.services.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#302720]/10 bg-[#eee5d8] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#302720]/55"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 min-h-[72px] text-[13px] leading-6 text-[#302720]/55">
                    {salon.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#302720]/10 pt-5">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/35">
                        Reviews
                      </div>

                      <div className="mt-1 text-[12px] font-bold text-[#302720]/65">
                        {salon.reviews} client reviews
                      </div>
                    </div>

                    <Link
                      to={`/salons/${salon.slug}`}
                      className="group/link flex h-11 items-center gap-3 rounded-[9px] border border-[#76552f]/30 bg-[#c5a477] px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#302720] shadow-[0_6px_18px_rgba(118,85,47,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dfcba9] hover:shadow-[0_10px_24px_rgba(118,85,47,0.17)]"
                    >
                      View salon

                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-[9px] transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-[15px] border border-[#302720]/12 bg-[#f5eee4] px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dfcba9]/35 text-[#76552f]">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>

            <h3 className="mt-5 font-display text-[30px] text-[#302720]">
              No salons found
            </h3>

            <p className="mx-auto mt-3 max-w-[430px] text-[13px] leading-6 text-[#302720]/50">
              Try changing your search or removing one of the filters to see
              more beauty spaces.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 h-[48px] rounded-[9px] border border-[#76552f]/30 bg-[#c5a477] px-6 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#302720] shadow-[0_6px_18px_rgba(118,85,47,0.12)] transition-all duration-300 hover:bg-[#dfcba9]"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* SERVICES CTA */}
      <section className="mx-auto max-w-[1580px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <div className="overflow-hidden rounded-[18px] border border-[#302720]/10 bg-[#e1d3c0]">
          <div className="grid items-center lg:grid-cols-[1fr_0.75fr]">
            <div className="px-7 py-10 sm:px-10 lg:px-14 lg:py-14">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#76552f]">
                Looking for something specific?
              </div>

              <h2 className="mt-3 max-w-[650px] font-display text-[38px] leading-[1.02] tracking-[-0.045em] text-[#302720] sm:text-[48px]">
                Find a service, then let GLOW find the place.
              </h2>

              <p className="mt-5 max-w-[560px] text-[14px] leading-7 text-[#302720]/55">
                Browse our service collection and start your appointment from
                the treatment you already have in mind.
              </p>

              <Link
                to="/services"
                className="mt-7 inline-flex h-[52px] items-center gap-4 rounded-[9px] border border-[#76552f]/40 bg-[#9a7444] px-6 text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#fffaf2] shadow-[0_8px_25px_rgba(118,85,47,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#76552f]"
              >
                Explore services

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[9px]"
                />
              </Link>
            </div>

            <div className="relative hidden h-full min-h-[330px] lg:block">
              <img
                src="/images/glow-beauty.jpg"
                alt="Beauty experience"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#e1d3c0] via-transparent to-transparent" />

              <div className="absolute bottom-7 right-7 flex items-center gap-3 rounded-[10px] border border-white/10 bg-[#f5eee4]/80 px-4 py-3 shadow-[0_12px_30px_rgba(48,39,32,0.12)] backdrop-blur-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfcba9] text-[#302720]">
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="text-[11px]"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-extrabold text-[#302720]">
                    Ready when you are
                  </div>

                  <div className="mt-0.5 text-[9px] text-[#302720]/45">
                    Your next beauty moment starts here
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Salons;