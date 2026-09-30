import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiCall } from "../api";

const fallbackImages = [
  "/images/salon-export.jpg",
  "/images/glow-space.jpg.jpg",
  "/images/glow-beauty.jpg",
];

const categories = [
  {
    id: "makeup",
    name: "Makeup",
    icon: "✦",
    services: [
      "Soft Glam Makeup",
      "Full Glam Makeup",
      "Bridal Makeup",
      "Henna Makeup",
    ],
  },
  {
    id: "hair",
    name: "Hair",
    icon: "◌",
    services: [
      "Hair Styling",
      "Hair Cut",
      "Hair Coloring",
      "Hair Treatment",
      "Bridal Hair",
    ],
  },
  {
    id: "nails",
    name: "Nails",
    icon: "◇",
    services: [
      "Classic Manicure",
      "Classic Pedicure",
      "Gel Nails",
      "Nail Art",
      "Bridal Nails",
    ],
  },
  {
    id: "beauty",
    name: "Beauty Care",
    icon: "○",
    services: [
      "Facial",
      "Deep Cleansing",
      "Skin Care",
      "Beauty Treatment",
    ],
  },
  {
    id: "brows",
    name: "Brows & Lashes",
    icon: "⌁",
    services: [
      "Eyebrow Shaping",
      "Eyebrow Tint",
      "Lash Lift",
      "Eyelash Extensions",
    ],
  },
  {
    id: "massage",
    name: "Massage",
    icon: "∞",
    services: [
      "Relaxing Massage",
      "Full Body Massage",
      "Back Massage",
      "Head Massage",
    ],
  },
  {
    id: "care",
    name: "Complete Care",
    icon: "♡",
    services: [
      "Complete Beauty Care",
      "Hair & Makeup",
      "Bridal Package",
      "Luxury Care Package",
    ],
  },
  {
    id: "consultation",
    name: "Free Consultation",
    icon: "◎",
    services: [
      "Beauty Consultation",
      "Hair Consultation",
      "Bridal Consultation",
    ],
  },
];

const times = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "");
}

function formatTimeTo24(time) {
  const [timePart, period] = time.split(" ");
  let [hour, minute] = timePart.split(":").map(Number);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "";
  }

  return `${Number(price).toLocaleString()} IQD`;
}

export default function Bookings() {
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);

  const [salons, setSalons] = useState([]);
  const [backendServices, setBackendServices] = useState([]);

  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    notes: "",
  });

  // ---------------------------------------------------------
  // LOAD SALONS FROM BACKEND
  // ---------------------------------------------------------
  useEffect(() => {
    const loadSalons = async () => {
      try {
        const result = await apiCall("/salons");

        const data = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        const formattedSalons = data.map((salon, index) => ({
          id: salon.id,
          name: salon.name || "GLOW Salon",
          location:
            salon.address ||
            salon.location ||
            "Basra · Iraq",
          image:
            salon.image ||
            salon.image_url ||
            fallbackImages[index % fallbackImages.length],
          description:
            salon.description ||
            "A refined beauty destination for your next beauty experience.",
          rating: salon.rating || "4.8",
          slug: salon.slug,
        }));

        setSalons(formattedSalons);
      } catch (error) {
        console.error("Failed to load salons:", error);
      }
    };

    loadSalons();
  }, []);

  // ---------------------------------------------------------
  // URL PRE-SELECTION
  // /bookings?salonId=1&serviceId=2
  // ---------------------------------------------------------
  useEffect(() => {
    const salonIdFromUrl = searchParams.get("salonId");
    const serviceIdFromUrl = searchParams.get("serviceId");
    const serviceNameFromUrl = searchParams.get("service");

    if (!salons.length) return;

    if (salonIdFromUrl) {
      const foundSalon = salons.find(
        (salon) => String(salon.id) === String(salonIdFromUrl)
      );

      if (foundSalon) {
        chooseSalon(foundSalon, serviceIdFromUrl, serviceNameFromUrl);
      }
    }
  }, [salons, searchParams]);

  // ---------------------------------------------------------
  // LOAD SERVICES FOR SELECTED SALON
  // ---------------------------------------------------------
  const loadSalonServices = async (salonId) => {
    try {
      const result = await apiCall(`/services/salon/${salonId}`);

      const services = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      setBackendServices(services);

      return services;
    } catch (error) {
      console.error("Failed to load salon services:", error);
      setBackendServices([]);
      return [];
    }
  };

  // ---------------------------------------------------------
  // SELECT SALON
  // ---------------------------------------------------------
  const chooseSalon = async (
    salon,
    serviceIdFromUrl = null,
    serviceNameFromUrl = null
  ) => {
    setSelectedSalon(salon);
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedServiceId(null);
    setBookingError("");

    const services = await loadSalonServices(salon.id);

    // If URL contains serviceId, select that backend service
    if (serviceIdFromUrl) {
      const service = services.find(
        (item) => String(item.id) === String(serviceIdFromUrl)
      );

      if (service) {
        setSelectedService(service.name);
        setSelectedServiceId(service.id);

        const category = categories.find((cat) =>
          cat.services.some(
            (name) =>
              normalizeText(name) === normalizeText(service.name)
          )
        );

        if (category) {
          setSelectedCategory(category.id);
        }

        return;
      }
    }

    // If URL contains service name
    if (serviceNameFromUrl) {
      const service = services.find(
        (item) =>
          normalizeText(item.name) ===
          normalizeText(serviceNameFromUrl)
      );

      if (service) {
        setSelectedService(service.name);
        setSelectedServiceId(service.id);
      }
    }
  };

  // ---------------------------------------------------------
  // SELECT CATEGORY
  // ---------------------------------------------------------
  const chooseCategory = (category) => {
    setSelectedCategory(category.id);
    setSelectedService(null);
    setSelectedServiceId(null);
    setBookingError("");
  };

  // ---------------------------------------------------------
  // SELECT SERVICE
  // ---------------------------------------------------------
  const chooseService = (serviceName) => {
    setSelectedService(serviceName);
    setBookingError("");

    const backendService = backendServices.find(
      (service) =>
        normalizeText(service.name) === normalizeText(serviceName)
    );

    if (backendService) {
      setSelectedServiceId(backendService.id);
    } else {
      setSelectedServiceId(null);
    }
  };

  // ---------------------------------------------------------
  // FIND CURRENT CATEGORY
  // ---------------------------------------------------------
  const activeCategory = useMemo(() => {
    return categories.find(
      (category) => category.id === selectedCategory
    );
  }, [selectedCategory]);

  // ---------------------------------------------------------
  // MATCH STATIC CATEGORY SERVICES WITH BACKEND
  // ---------------------------------------------------------
  const availableServicesForCategory = useMemo(() => {
    if (!activeCategory) return [];

    return activeCategory.services.map((serviceName) => {
      const backendService = backendServices.find(
        (service) =>
          normalizeText(service.name) ===
          normalizeText(serviceName)
      );

      return {
        name: serviceName,
        backend: backendService || null,
      };
    });
  }, [activeCategory, backendServices]);

  // ---------------------------------------------------------
  // NEXT STEP
  // ---------------------------------------------------------
  const nextStep = async () => {
    setBookingError("");

    if (currentStep === 1) {
      if (!selectedSalon) {
        setBookingError("Please select a salon first.");
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!selectedCategory) {
        setBookingError("Please select a service category.");
        return;
      }

      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!selectedService) {
        setBookingError("Please select a service.");
        return;
      }

      if (!selectedServiceId) {
        const matchingService = backendServices.find(
          (service) =>
            normalizeText(service.name) ===
            normalizeText(selectedService)
        );

        if (matchingService) {
          setSelectedServiceId(matchingService.id);
        } else {
          setBookingError(
            "This service is not available for the selected salon."
          );
          return;
        }
      }

      if (!selectedDate) {
        setBookingError("Please select a date.");
        return;
      }

      if (!selectedTime) {
        setBookingError("Please select a time.");
        return;
      }

      setCurrentStep(4);
      return;
    }

    // -------------------------------------------------------
    // FINAL STEP → CREATE BOOKING
    // -------------------------------------------------------
    if (currentStep === 4) {
      const token = localStorage.getItem("glow_token");

      if (!token) {
        setBookingError("Please login before making a booking.");
        return;
      }

      let finalServiceId = selectedServiceId;

      if (!finalServiceId) {
        const matchingService = backendServices.find(
          (service) =>
            normalizeText(service.name) ===
            normalizeText(selectedService)
        );

        if (matchingService) {
          finalServiceId = matchingService.id;
        }
      }

      if (!finalServiceId) {
        setBookingError(
          "This service is not available for the selected salon."
        );
        return;
      }

      setBookingLoading(true);
      setBookingError("");

      try {
        const bookingTime = formatTimeTo24(selectedTime);

        await apiCall(
          "/bookings",
          "POST",
          {
            salon_id: selectedSalon.id,
            service_id: finalServiceId,
            booking_date: selectedDate,
            booking_time: bookingTime,
            notes: customer.notes.trim() || null,
          },
          token
        );

        setSubmitted(true);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        setBookingError(
          error.message || "Failed to create booking."
        );
      } finally {
        setBookingLoading(false);
      }
    }
  };

  // ---------------------------------------------------------
  // PREVIOUS STEP
  // ---------------------------------------------------------
  const previousStep = () => {
    setBookingError("");

    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  };

  // ---------------------------------------------------------
  // RESET BOOKING
  // ---------------------------------------------------------
  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedSalon(null);
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedServiceId(null);
    setSelectedDate("");
    setSelectedTime("");
    setSubmitted(false);
    setBookingError("");
    setCustomer({
      name: "",
      phone: "",
      notes: "",
    });
  };

  // ---------------------------------------------------------
  // SUCCESS SCREEN
  // ---------------------------------------------------------
  if (submitted) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F7F3E8",
          color: "#332A23",
          padding: "120px 24px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              margin: "0 auto 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#DCC9A7",
              color: "#332A23",
              fontSize: "38px",
            }}
          >
            ✓
          </div>

          <p
            style={{
              fontSize: "13px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#8A724C",
              marginBottom: "18px",
            }}
          >
            Booking Confirmed
          </p>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 82px)",
              fontWeight: 400,
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "-3px",
            }}
          >
            Your appointment
            <br />
            is reserved.
          </h1>

          <p
            style={{
              maxWidth: "560px",
              margin: "30px auto 0",
              color: "#6f6257",
              fontSize: "17px",
              lineHeight: 1.8,
            }}
          >
            Thank you for choosing GLOW. Your booking request has
            been successfully sent to the salon.
          </p>

          <div
            style={{
              marginTop: "42px",
              padding: "30px",
              background: "#EFE5D3",
              border: "1px solid rgba(138,114,76,0.2)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <div>
                <small
                  style={{
                    color: "#8A724C",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Salon
                </small>
                <div style={{ marginTop: "5px", fontSize: "18px" }}>
                  {selectedSalon?.name}
                </div>
              </div>

              <div>
                <small
                  style={{
                    color: "#8A724C",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Service
                </small>
                <div style={{ marginTop: "5px", fontSize: "18px" }}>
                  {selectedService}
                </div>
              </div>

              <div>
                <small
                  style={{
                    color: "#8A724C",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Date & Time
                </small>
                <div style={{ marginTop: "5px", fontSize: "18px" }}>
                  {selectedDate} · {selectedTime}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "38px",
            }}
          >
            <button
              onClick={resetBooking}
              style={{
                border: "1px solid #8A724C",
                background: "transparent",
                color: "#332A23",
                padding: "15px 28px",
                cursor: "pointer",
                letterSpacing: "1px",
              }}
            >
              New Booking
            </button>

            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#332A23",
                color: "#F7F3E8",
                padding: "15px 28px",
                textDecoration: "none",
                letterSpacing: "1px",
              }}
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------
  // MAIN PAGE
  // ---------------------------------------------------------
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F7F3E8",
        color: "#332A23",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          width: "min(1180px, calc(100% - 40px))",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            padding: "45px 0 60px",
            borderBottom: "1px solid rgba(51,42,35,0.12)",
          }}
        >
          <p
            style={{
              color: "#8A724C",
              fontSize: "12px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            GLOW · BOOKING
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(48px, 8vw, 92px)",
              lineHeight: 0.92,
              fontWeight: 400,
              letterSpacing: "-4px",
            }}
          >
            Book your
            <br />
            <span style={{ color: "#8A724C" }}>
              beauty moment.
            </span>
          </h1>

          <p
            style={{
              maxWidth: "610px",
              marginTop: "28px",
              color: "#6f6257",
              fontSize: "17px",
              lineHeight: 1.8,
            }}
          >
            Choose your salon, select your service, and find the
            perfect time for your next GLOW experience.
          </p>
        </header>

        {/* STEPS */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            margin: "32px 0 50px",
            flexWrap: "wrap",
          }}
        >
          {[
            ["01", "Salon"],
            ["02", "Service"],
            ["03", "Date"],
            ["04", "Confirm"],
          ].map(([number, label], index) => {
            const stepNumber = index + 1;
            const active = currentStep === stepNumber;
            const completed = currentStep > stepNumber;

            return (
              <div
                key={number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 17px",
                  border: `1px solid ${
                    active || completed
                      ? "#8A724C"
                      : "rgba(51,42,35,0.14)"
                  }`,
                  background:
                    active || completed
                      ? "#EDE2CC"
                      : "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "1px",
                    color:
                      active || completed
                        ? "#8A724C"
                        : "#9b8e82",
                  }}
                >
                  {number}
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ERROR */}
        {bookingError && (
          <div
            style={{
              marginBottom: "30px",
              padding: "17px 20px",
              border: "1px solid rgba(150,70,50,0.3)",
              background: "#f3e4d9",
              color: "#744332",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            {bookingError}
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <section>
            <div style={{ marginBottom: "30px" }}>
              <p
                style={{
                  color: "#8A724C",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Step 01
              </p>

              <h2
                style={{
                  fontSize: "clamp(34px, 5vw, 58px)",
                  fontWeight: 400,
                  margin: "8px 0 0",
                  letterSpacing: "-2px",
                }}
              >
                Choose a salon
              </h2>
            </div>

            {salons.length === 0 ? (
              <div
                style={{
                  padding: "50px 20px",
                  border: "1px solid rgba(51,42,35,0.12)",
                  textAlign: "center",
                  color: "#7d7065",
                }}
              >
                No salons available yet.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "22px",
                }}
              >
                {salons.map((salon) => {
                  const active =
                    selectedSalon?.id === salon.id;

                  return (
                    <button
                      key={salon.id}
                      onClick={() => chooseSalon(salon)}
                      style={{
                        padding: 0,
                        textAlign: "left",
                        border: active
                          ? "2px solid #8A724C"
                          : "1px solid rgba(51,42,35,0.13)",
                        background: "#EFE5D3",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "240px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={salon.image}
                          alt={salon.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>

                      <div style={{ padding: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "15px",
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "25px",
                              fontWeight: 400,
                            }}
                          >
                            {salon.name}
                          </h3>

                          <span
                            style={{
                              color: "#8A724C",
                              fontSize: "14px",
                            }}
                          >
                            ★ {salon.rating}
                          </span>
                        </div>

                        <p
                          style={{
                            color: "#8A724C",
                            fontSize: "13px",
                            margin: "10px 0",
                          }}
                        >
                          {salon.location}
                        </p>

                        <p
                          style={{
                            color: "#76695e",
                            fontSize: "14px",
                            lineHeight: 1.7,
                            margin: "14px 0 0",
                          }}
                        >
                          {salon.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <section>
            <div style={{ marginBottom: "30px" }}>
              <p
                style={{
                  color: "#8A724C",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Step 02
              </p>

              <h2
                style={{
                  fontSize: "clamp(34px, 5vw, 58px)",
                  fontWeight: 400,
                  margin: "8px 0 0",
                  letterSpacing: "-2px",
                }}
              >
                Choose a category
              </h2>

              <p
                style={{
                  marginTop: "15px",
                  color: "#76695e",
                }}
              >
                {selectedSalon?.name}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "15px",
              }}
            >
              {categories.map((category) => {
                const active =
                  selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => chooseCategory(category)}
                    style={{
                      minHeight: "170px",
                      padding: "25px",
                      textAlign: "left",
                      border: active
                        ? "2px solid #8A724C"
                        : "1px solid rgba(51,42,35,0.13)",
                      background: active
                        ? "#EDE2CC"
                        : "#EFE5D3",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "30px",
                        color: "#8A724C",
                        marginBottom: "20px",
                      }}
                    >
                      {category.icon}
                    </div>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 400,
                      }}
                    >
                      {category.name}
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#8b7d70",
                      }}
                    >
                      {category.services.length} services
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <section>
            <div style={{ marginBottom: "30px" }}>
              <p
                style={{
                  color: "#8A724C",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Step 03
              </p>

              <h2
                style={{
                  fontSize: "clamp(34px, 5vw, 58px)",
                  fontWeight: 400,
                  margin: "8px 0 0",
                  letterSpacing: "-2px",
                }}
              >
                Select your service
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "15px",
              }}
            >
              {availableServicesForCategory.map(
                ({ name, backend }) => {
                  const active =
                    selectedService ===
                    (backend?.name || name);

                  return (
                    <button
                      key={name}
                      onClick={() =>
                        chooseService(backend?.name || name)
                      }
                      style={{
                        padding: "23px",
                        textAlign: "left",
                        border: active
                          ? "2px solid #8A724C"
                          : "1px solid rgba(51,42,35,0.13)",
                        background: active
                          ? "#EDE2CC"
                          : "#EFE5D3",
                        cursor: "pointer",
                        opacity: backend ? 1 : 0.55,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "15px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "18px",
                          }}
                        >
                          {backend?.name || name}
                        </span>

                        {backend?.price !== undefined &&
                          backend?.price !== null && (
                            <span
                              style={{
                                color: "#8A724C",
                                whiteSpace: "nowrap",
                                fontSize: "13px",
                              }}
                            >
                              {formatPrice(backend.price)}
                            </span>
                          )}
                      </div>

                      {backend?.description && (
                        <p
                          style={{
                            color: "#7b6e63",
                            fontSize: "13px",
                            lineHeight: 1.6,
                            marginTop: "10px",
                          }}
                        >
                          {backend.description}
                        </p>
                      )}

                      {!backend && (
                        <p
                          style={{
                            color: "#9b8e82",
                            fontSize: "12px",
                            marginTop: "10px",
                          }}
                        >
                          Not available at this salon
                        </p>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {/* DATE + TIME */}
            {selectedService && selectedServiceId && (
              <div
                style={{
                  marginTop: "50px",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "35px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#8A724C",
                      fontSize: "12px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    Appointment date
                  </p>

                  <input
                    type="date"
                    value={selectedDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(event) =>
                      setSelectedDate(event.target.value)
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "17px",
                      background: "#EFE5D3",
                      border:
                        "1px solid rgba(51,42,35,0.15)",
                      color: "#332A23",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <p
                    style={{
                      color: "#8A724C",
                      fontSize: "12px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    Appointment time
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {times.map((time) => {
                      const active = selectedTime === time;

                      return (
                        <button
                          key={time}
                          onClick={() =>
                            setSelectedTime(time)
                          }
                          style={{
                            padding: "13px 5px",
                            border: active
                              ? "1px solid #8A724C"
                              : "1px solid rgba(51,42,35,0.12)",
                            background: active
                              ? "#DCC9A7"
                              : "#EFE5D3",
                            color: "#332A23",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <section>
            <div style={{ marginBottom: "35px" }}>
              <p
                style={{
                  color: "#8A724C",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Step 04
              </p>

              <h2
                style={{
                  fontSize: "clamp(34px, 5vw, 58px)",
                  fontWeight: 400,
                  margin: "8px 0 0",
                  letterSpacing: "-2px",
                }}
              >
                Confirm your booking
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(280px, 0.9fr) minmax(300px, 1.1fr)",
                gap: "30px",
              }}
            >
              {/* SUMMARY */}
              <div
                style={{
                  background: "#EFE5D3",
                  padding: "30px",
                  border:
                    "1px solid rgba(51,42,35,0.12)",
                }}
              >
                <p
                  style={{
                    color: "#8A724C",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                  }}
                >
                  Your appointment
                </p>

                <div
                  style={{
                    marginTop: "25px",
                    display: "grid",
                    gap: "22px",
                  }}
                >
                  <div>
                    <small
                      style={{
                        color: "#8b7d70",
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                      }}
                    >
                      Salon
                    </small>

                    <div
                      style={{
                        fontSize: "21px",
                        marginTop: "5px",
                      }}
                    >
                      {selectedSalon?.name}
                    </div>
                  </div>

                  <div>
                    <small
                      style={{
                        color: "#8b7d70",
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                      }}
                    >
                      Service
                    </small>

                    <div
                      style={{
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      {selectedService}
                    </div>
                  </div>

                  <div>
                    <small
                      style={{
                        color: "#8b7d70",
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                      }}
                    >
                      Date
                    </small>

                    <div
                      style={{
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      {selectedDate}
                    </div>
                  </div>

                  <div>
                    <small
                      style={{
                        color: "#8b7d70",
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                      }}
                    >
                      Time
                    </small>

                    <div
                      style={{
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      {selectedTime}
                    </div>
                  </div>

                  {selectedServiceId && (
                    <div>
                      <small
                        style={{
                          color: "#8b7d70",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                        }}
                      >
                        Service ID
                      </small>

                      <div
                        style={{
                          fontSize: "14px",
                          marginTop: "5px",
                          color: "#8A724C",
                        }}
                      >
                        #{selectedServiceId}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CUSTOMER INFO */}
              <div
                style={{
                  background: "#EFE5D3",
                  padding: "30px",
                  border:
                    "1px solid rgba(51,42,35,0.12)",
                }}
              >
                <p
                  style={{
                    color: "#8A724C",
                    fontSize: "11px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                  }}
                >
                  Your details
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "20px",
                    marginTop: "25px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        marginBottom: "9px",
                        color: "#7d7065",
                      }}
                    >
                      Name
                    </label>

                    <input
                      type="text"
                      value={customer.name}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          name: event.target.value,
                        })
                      }
                      placeholder="Your name"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "15px",
                        background: "#F7F3E8",
                        border:
                          "1px solid rgba(51,42,35,0.13)",
                        outline: "none",
                        color: "#332A23",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        marginBottom: "9px",
                        color: "#7d7065",
                      }}
                    >
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          phone: event.target.value,
                        })
                      }
                      placeholder="+964..."
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "15px",
                        background: "#F7F3E8",
                        border:
                          "1px solid rgba(51,42,35,0.13)",
                        outline: "none",
                        color: "#332A23",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        marginBottom: "9px",
                        color: "#7d7065",
                      }}
                    >
                      Notes
                    </label>

                    <textarea
                      rows="5"
                      value={customer.notes}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          notes: event.target.value,
                        })
                      }
                      placeholder="Anything you'd like us to know..."
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "15px",
                        background: "#F7F3E8",
                        border:
                          "1px solid rgba(51,42,35,0.13)",
                        outline: "none",
                        color: "#332A23",
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* NAVIGATION */}
        <div
          style={{
            marginTop: "50px",
            paddingTop: "28px",
            borderTop:
              "1px solid rgba(51,42,35,0.12)",
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <button
            onClick={previousStep}
            disabled={currentStep === 1 || bookingLoading}
            style={{
              padding: "15px 25px",
              border:
                "1px solid rgba(51,42,35,0.18)",
              background: "transparent",
              color: "#332A23",
              cursor:
                currentStep === 1
                  ? "not-allowed"
                  : "pointer",
              opacity: currentStep === 1 ? 0.35 : 1,
            }}
          >
            ← Back
          </button>

          <button
            onClick={nextStep}
            disabled={bookingLoading}
            style={{
              padding: "16px 32px",
              border: "none",
              background: "#332A23",
              color: "#F7F3E8",
              cursor: bookingLoading
                ? "wait"
                : "pointer",
              minWidth: "170px",
              letterSpacing: "1px",
            }}
          >
            {currentStep === 4
              ? bookingLoading
                ? "Sending..."
                : "Confirm Booking"
              : "Continue →"}
          </button>
        </div>
      </div>
    </main>
  );
}