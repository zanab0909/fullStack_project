import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCalendarCheck,
  faLocationDot,
  faStar,
  faClock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { apiCall } from "../api";

const fallbackImage = "/images/salon-export.jpg";

function SalonProfile() {
  const { slug } = useParams();

  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSalon = async () => {
      try {
        /*
          The salon URL currently uses a slug.
          We first load all salons, then find the matching salon.
        */
        const result = await apiCall("/salons");

        const salons = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        const foundSalon = salons.find((item) => {
          const itemSlug = String(item.slug || item.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          return (
            String(item.id) === String(slug) ||
            itemSlug === String(slug).toLowerCase()
          );
        });

        if (!foundSalon) {
          if (mounted) {
            setSalon(null);
          }
          return;
        }

        let services = [];

        try {
          const servicesResult = await apiCall(
            `/services/salon/${foundSalon.id}`
          );

          services = Array.isArray(servicesResult?.data)
            ? servicesResult.data
            : Array.isArray(servicesResult)
            ? servicesResult
            : [];
        } catch (serviceError) {
          console.error("Failed to load salon services:", serviceError);
        }

        const formattedSalon = {
          id: foundSalon.id,
          name: foundSalon.name || "GLOW Salon",
          location:
            foundSalon.address ||
            foundSalon.location ||
            "Basra · Iraq",
          rating: foundSalon.rating || "4.8",
          reviews: foundSalon.reviews || 0,
          image:
            foundSalon.image ||
            foundSalon.image_url ||
            fallbackImage,
          description:
            foundSalon.description ||
            "A refined beauty destination where modern beauty services meet a calm, elegant atmosphere.",
          phone: foundSalon.phone || "",
          services: services.map((service) => ({
            id: service.id,
            name: service.name || "Beauty Service",
            price:
              service.price !== undefined &&
              service.price !== null
                ? `$${service.price}`
                : "Contact salon",
            duration:
              service.duration !== undefined &&
              service.duration !== null
                ? `${service.duration} min`
                : "Available on request",
          })),
        };

        if (mounted) {
          setSalon(formattedSalon);
        }
      } catch (error) {
        console.error("Failed to load salon:", error);

        if (mounted) {
          setSalon(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSalon();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="glow-page">
        <section className="mx-auto max-w-[1580px] px-5 py-20 sm:px-8 lg:px-12">
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[20px] border border-[#302720]/10 bg-[#f5eee4]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#302720]/10 border-t-[#9a7444]" />

            <p className="mt-5 text-[12px] font-bold text-[#302720]/45">
              Loading salon...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!salon) {
    return (
      <main className="glow-page">
        <section className="mx-auto max-w-[1580px] px-5 py-20 sm:px-8 lg:px-12">
          <div className="rounded-[20px] border border-[#302720]/10 bg-[#f5eee4] px-6 py-20 text-center">
            <h1 className="font-display text-[40px] text-[#302720]">
              Salon not found
            </h1>

            <p className="mx-auto mt-4 max-w-[450px] text-[13px] leading-6 text-[#302720]/50">
              We couldn't find this salon. Please return to the salons page
              and choose another beauty space.
            </p>

            <Link
              to="/salons"
              className="mt-7 inline-flex h-[50px] items-center gap-3 rounded-[10px] bg-[#9a7444] px-6 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#fffaf2] transition-all hover:bg-[#76552f]"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to salons
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="glow-page">
      <section className="mx-auto max-w-[1580px] px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
        <Link
          to="/salons"
          className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#76552f] transition-colors hover:text-[#9a7444]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
          Back to salons
        </Link>

        <div className="mt-7 grid overflow-hidden rounded-[20px] border border-[#302720]/10 bg-[#f5eee4] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[430px] lg:min-h-[600px]">
            <img
              src={salon.image}
              alt={salon.name}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17120f]/65 via-transparent to-transparent" />

            <div className="absolute bottom-7 left-7 right-7 sm:bottom-10 sm:left-10">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#dfcba9]">
                <FontAwesomeIcon icon={faLocationDot} />
                {salon.location}
              </div>

              <h1 className="font-display text-[46px] leading-[0.98] tracking-[-0.05em] text-[#f5eee4] sm:text-[62px]">
                {salon.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#dfcba9]/35 px-4 py-2">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-[10px] text-[#9a7444]"
                />

                <span className="text-[12px] font-extrabold text-[#302720]">
                  {salon.rating}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-[#302720]/45">
                {salon.reviews} reviews
              </span>
            </div>

            <p className="mt-7 text-[15px] leading-8 text-[#302720]/60">
              {salon.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-[#302720]/10 bg-[#eee5d8] p-4">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-[#9a7444]"
                />

                <div className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#302720]/45">
                  Hours
                </div>

                <div className="mt-1 text-[13px] font-bold">
                  10:00 — 21:00
                </div>
              </div>

              <div className="rounded-[12px] border border-[#302720]/10 bg-[#eee5d8] p-4">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-[#9a7444]"
                />

                <div className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#302720]/45">
                  Location
                </div>

                <div className="mt-1 text-[13px] font-bold">
                  {salon.location}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/bookings?salonId=${salon.id}`}
                className="inline-flex h-[54px] items-center justify-center gap-3 rounded-[10px] border border-[#76552f]/35 bg-[#9a7444] px-7 text-[11px] font-extrabold uppercase tracking-[0.11em] text-[#fffaf2] shadow-[0_8px_25px_rgba(118,85,47,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#76552f]"
              >
                Book an appointment

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[10px]"
                />
              </Link>

              <a
                href={
                  salon.phone
                    ? `tel:${salon.phone}`
                    : "#"
                }
                className="inline-flex h-[54px] items-center justify-center gap-3 rounded-[10px] border border-[#76552f]/25 bg-[#dfcba9]/55 px-7 text-[11px] font-extrabold uppercase tracking-[0.11em] text-[#76552f] transition-all hover:bg-[#dfcba9]"
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-[10px]"
                />

                Contact salon
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1580px] px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mb-8">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9a7444]">
            Available treatments
          </div>

          <h2 className="mt-2 font-display text-[40px] tracking-[-0.045em] text-[#302720]">
            Choose your service
          </h2>
        </div>

        {salon.services.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {salon.services.map((service, index) => (
              <motion.div
                key={service.id || service.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[14px] border border-[#302720]/10 bg-[#f5eee4] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(48,39,32,0.1)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[24px] text-[#302720]">
                      {service.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#302720]/45">
                      <FontAwesomeIcon icon={faClock} />
                      {service.duration}
                    </div>
                  </div>

                  <div className="font-display text-[25px] text-[#9a7444]">
                    {service.price}
                  </div>
                </div>

                <Link
                  to={`/bookings?salonId=${salon.id}&serviceId=${service.id || ""}`}
                  className="mt-6 flex h-[45px] items-center justify-center gap-2 rounded-[9px] border border-[#76552f]/25 bg-[#dfcba9]/50 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#76552f] transition-colors hover:bg-[#dfcba9]"
                >
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  Select service
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-[14px] border border-[#302720]/10 bg-[#f5eee4] px-6 py-14 text-center">
            <p className="text-[13px] font-semibold text-[#302720]/45">
              No services are available for this salon yet.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default SalonProfile;