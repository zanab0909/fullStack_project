import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import salons from "../data/salons";
import "./Profile.css";

const DEFAULT_PORTRAIT =
  "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=800";

const STYLE_TAGS = [
  {
    id: "soft-glam",
    label: "SOFT GLAM",
    keywords: ["مكياج", "عروس", "مناسب"],
  },
  {
    id: "nails",
    label: "NAILS",
    keywords: ["أظافر", "جلش"],
  },
  {
    id: "hair",
    label: "HAIR CARE",
    keywords: ["شعر", "تصفيف", "صبغ", "تلوين", "تقليم", "تسريح"],
  },
  {
    id: "skin",
    label: "SKIN CARE",
    keywords: ["بشرة", "ليزر"],
  },
];

const padStat = (value) => String(Math.max(0, Math.round(value))).padStart(2, "0");

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const from = valueRef.current;
    if (from === target) return;
    let raf;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  if (prefersReducedMotion()) return target;
  return value;
}

function HeartButton({ filled, onClick, label }) {
  return (
    <button
      type="button"
      className={`closet-heart${filled ? " is-filled" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={filled}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}

function apptDateParts(iso) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "", weekday: "" };
  }
  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString("ar", { month: "short" }),
    weekday: date.toLocaleDateString("ar", { weekday: "long" }),
  };
}

function apptTimeLabel(time) {
  const date = new Date(`2000-01-01T${time}:00`);
  return Number.isNaN(date.getTime())
    ? time
    : date.toLocaleTimeString("ar", { hour: "numeric", minute: "2-digit" });
}

function salonMatchesStyle(salon, tag) {
  if (!tag) return true;
  return salon.services.some((service) =>
    tag.keywords.some((keyword) => service.includes(keyword))
  );
}

function Profile() {
  const infoRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "اسم المستخدم",
    phone: "07XXXXXXXXX",
    email: "example@email.com",
    city: "البصرة",
    photo: DEFAULT_PORTRAIT,
    memberNo: "BP-2026-01",
    memberSince: 2026,
  });
  const [formData, setFormData] = useState(user);
  const [selectedStyle, setSelectedStyle] = useState("nails");
  const [portraitBroken, setPortraitBroken] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
    infoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const handleSave = () => {
    setUser(formData);
    setPortraitBroken(false);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  const [savedSalons, setSavedSalons] = useState(salons.slice(0, 3));
  const [removingId, setRemovingId] = useState(null);
  const [pulseId, setPulseId] = useState(null);

  const removeSalon = (id) => {
    if (removingId) return;
    setRemovingId(id);
    setTimeout(() => {
      setSavedSalons((currentSalons) =>
        currentSalons.filter((salon) => salon.id !== id)
      );
      setRemovingId(null);
    }, 380);
  };

  const addSalon = (id) => {
    setSavedSalons((currentSalons) =>
      currentSalons.some((salon) => salon.id === id)
        ? currentSalons
        : [...currentSalons, salons.find((salon) => salon.id === id)]
    );
    setPulseId(id);
    setTimeout(
      () => setPulseId((current) => (current === id ? null : current)),
      500
    );
  };

  const activeTag = STYLE_TAGS.find((tag) => tag.id === selectedStyle);

  const railSalons = salons.filter((salon) => {
    const unsaved =
      !savedSalons.some((saved) => saved.id === salon.id) || salon.id === pulseId;
    return unsaved && salonMatchesStyle(salon, activeTag);
  });

  const topServices = useMemo(() => {
    const counts = new Map();
    savedSalons.forEach((salon) => {
      salon.services.forEach((service) => {
        counts.set(service, (counts.get(service) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([service]) => service);
  }, [savedSalons]);

  const [appointments, setAppointments] = useState([]);
  const [apptForm, setApptForm] = useState({
    salonId: "",
    service: "",
    date: "",
    time: "",
  });
  const [apptError, setApptError] = useState(false);
  const [apptSaved, setApptSaved] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);

  const selectedSalon = salons.find(
    (salon) => String(salon.id) === apptForm.salonId
  );

  const handleApptChange = (e) => {
    const { name, value } = e.target;
    setApptForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "salonId" ? { service: "" } : {}),
    }));
    setApptError(false);
  };

  const handleApptSave = () => {
    if (!apptForm.salonId || !apptForm.service || !apptForm.date || !apptForm.time) {
      setApptError(true);
      return;
    }
    const salon = salons.find((item) => String(item.id) === apptForm.salonId);
    setAppointments((current) => [
      ...current,
      {
        id: Date.now(),
        salonName: salon.name,
        service: apptForm.service,
        date: apptForm.date,
        time: apptForm.time,
      },
    ]);
    setApptForm({ salonId: "", service: "", date: "", time: "" });
    setApptError(false);
    setApptSaved(true);
    setTimeout(() => setApptSaved(false), 1400);
  };

  const cancelAppointment = (id) => {
    if (cancelingId) return;
    setCancelingId(id);
    setTimeout(() => {
      setAppointments((current) => current.filter((appt) => appt.id !== id));
      setCancelingId(null);
    }, 320);
  };

  const sortedAppointments = [...appointments].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  );

  const animatedSaved = useCountUp(savedSalons.length);
  const animatedAppointments = useCountUp(appointments.length);
  const averageRating = savedSalons.length
    ? savedSalons.reduce((total, salon) => total + salon.rating, 0) /
      savedSalons.length
    : 0;
  const animatedRating = useCountUp(averageRating);

  const visitedSalons = new Set(appointments.map((appt) => appt.salonName));
  const triedServices = new Set(appointments.map((appt) => appt.service));
  const salonsVisited = visitedSalons.size || savedSalons.length;
  const servicesTried = triedServices.size || topServices.length;
  const savedLooks = savedSalons.length * 4 + appointments.length;

  const showPortrait = Boolean(user.photo) && !portraitBroken;
  const cityEn = user.city.includes("البصرة") ? "Basra" : user.city;

  const collectionItems = [
    {
      id: "saved",
      icon: "♡",
      en: "Saved Salons",
      ar: "الصالونات اللي حفظتها",
      image: savedSalons[0]?.image || salons[0].image,
      target: "closet-heading-favorites",
    },
    {
      id: "services",
      icon: "✦",
      en: "Favorite Services",
      ar: "الخدمات المفضلة",
      image: savedSalons[1]?.image || salons[3].image,
      target: "closet-heading-style",
    },
    {
      id: "appointments",
      icon: "◷",
      en: "Appointments",
      ar: "المواعيد القادمة",
      image: savedSalons[2]?.image || salons[5].image,
      target: "closet-heading-appointments",
    },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="closet-page">
      <header className="closet-hero">
        <div className="closet-hero-backdrop" aria-hidden="true">
          <span className="closet-hero-circle" />
          <span className="closet-hero-watermark" dir="ltr">01</span>
          <span className="closet-crop closet-crop-tl" />
          <span className="closet-crop closet-crop-tr" />
          <span className="closet-crop closet-crop-bl" />
          <span className="closet-crop closet-crop-br" />
        </div>

        <span className="closet-hero-side" dir="ltr" aria-hidden="true">
          BEAUTY
        </span>

        <div className="closet-hero-topline">
          <span className="closet-hero-emblem" aria-hidden="true">✦</span>
          <span className="closet-hero-brand" dir="ltr">BEAUTY PASSPORT</span>
          <span className="closet-hero-edition">بطاقتكِ الجمالية</span>
          <span className="closet-hero-since" dir="ltr">
            Member since {user.memberSince}
          </span>
        </div>

        <div className="closet-portrait-cluster">
          <span className="closet-portrait-halo" aria-hidden="true" />
          <span className="closet-portrait-behind" dir="ltr" aria-hidden="true">
            BEAUTY MEMBER
          </span>
          <div className="closet-portrait">
            {showPortrait ? (
              <img
                src={user.photo}
                alt=""
                className="closet-portrait-photo"
                onError={() => setPortraitBroken(true)}
              />
            ) : (
              <span className="closet-portrait-letter">
                {user.name.trim().charAt(0) || "✦"}
              </span>
            )}
            <span className="closet-portrait-view">View Profile</span>
          </div>
        </div>

        <div className="closet-hero-main">
          <div className="closet-hero-title">
            <p className="closet-hero-id" dir="ltr">
              Beauty ID · Member No. {user.memberNo}
            </p>
            <span className="closet-hero-badge" dir="ltr">
              GOLD MEMBER
            </span>
            <div className="closet-name-frame">
              <h1 className="closet-hero-name">{user.name}</h1>
            </div>
            <p className="closet-hero-tagline" dir="ltr">Your beauty, your style.</p>
            <dl className="closet-hero-details">
              <div>
                <dt>رقم الهاتف</dt>
                <dd dir="ltr">{user.phone}</dd>
              </div>
              <div>
                <dt>البريد الإلكتروني</dt>
                <dd dir="ltr">{user.email}</dd>
              </div>
              <div>
                <dt>المدينة</dt>
                <dd>{user.city}</dd>
              </div>
            </dl>
            <button type="button" className="closet-hero-edit" onClick={handleEdit}>
              Edit Profile ✦
            </button>
          </div>
        </div>

        <div className="closet-passport-strip" dir="ltr">
          <p className="closet-passport-kicker">
            BEAUTY PASSPORT <span>Member since {user.memberSince}</span>
          </p>
          <ul className="closet-passport-metrics">
            <li>
              <strong>{padStat(salonsVisited)}</strong>
              <span>Salons Visited</span>
            </li>
            <li>
              <strong>{padStat(servicesTried)}</strong>
              <span>Services Tried</span>
            </li>
            <li>
              <strong>{padStat(savedLooks)}</strong>
              <span>Saved Looks</span>
            </li>
          </ul>
        </div>

        <div className="closet-stats">
          <div className="closet-stat">
            <span className="closet-stat-icon" aria-hidden="true">♡</span>
            <strong className="closet-stat-number" dir="ltr">
              {padStat(animatedSaved)}
            </strong>
            <span className="closet-stat-label">صالونات محفوظة</span>
          </div>
          <div className="closet-stat">
            <span className="closet-stat-icon" aria-hidden="true">◷</span>
            <strong className="closet-stat-number" dir="ltr">
              {padStat(animatedAppointments)}
            </strong>
            <span className="closet-stat-label">مواعيد قادمة</span>
          </div>
          <div className="closet-stat">
            <span className="closet-stat-icon" aria-hidden="true">★</span>
            <strong className="closet-stat-number" dir="ltr">
              {savedSalons.length ? animatedRating.toFixed(1) : "—"}
            </strong>
            <span className="closet-stat-label">متوسط التقييم</span>
          </div>
          <div className="closet-stat closet-stat-city">
            <span className="closet-stat-icon" aria-hidden="true">⌖</span>
            <strong className="closet-stat-city-name" dir="ltr">{cityEn}</strong>
            <span className="closet-stat-label">الموقع</span>
          </div>
        </div>
      </header>

      <section className="closet-section" aria-labelledby="closet-heading-style">
        <div className="closet-section-heading">
          <span className="closet-section-index" dir="ltr" aria-hidden="true"></span>
          <h2 id="closet-heading-style">
            <span className="closet-section-en" dir="ltr">MY STYLE</span>
            <span className="closet-section-ar">أسلوبي</span>
          </h2>
          <span className="closet-section-rule" aria-hidden="true" />
        </div>

        <div className="closet-style-tags" role="tablist" aria-label="أسلوبكِ">
          {STYLE_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              role="tab"
              aria-selected={selectedStyle === tag.id}
              className={`closet-style-tag${selectedStyle === tag.id ? " is-active" : ""}`}
              onClick={() => setSelectedStyle(tag.id)}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <div className="closet-collection">
          <p className="closet-collection-kicker" dir="ltr">My Beauty Collection</p>
          <div className="closet-collection-grid">
            {collectionItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="closet-look"
                onClick={() => scrollTo(item.target)}
              >
                <img src={item.image} alt="" loading="lazy" />
                <span className="closet-look-veil" aria-hidden="true" />
                <span className="closet-look-copy">
                  <small dir="ltr">{item.icon} {item.en}</small>
                  <strong>{item.ar}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="closet-bento closet-bento-style">
          <article className="closet-tile closet-tile-info" ref={infoRef}>
            <div className="closet-tile-head">
              <h3>المعلومات الشخصية</h3>
              {!isEditing && (
                <button type="button" className="closet-edit-btn" onClick={handleEdit}>
                  تعديل
                </button>
              )}
            </div>

            {!isEditing ? (
              <dl className="closet-info-grid">
                <div className="closet-info-item">
                  <dt>الاسم</dt>
                  <dd>{user.name}</dd>
                </div>
                <div className="closet-info-item">
                  <dt>رقم الهاتف</dt>
                  <dd dir="ltr">{user.phone}</dd>
                </div>
                <div className="closet-info-item">
                  <dt>البريد الإلكتروني</dt>
                  <dd dir="ltr">{user.email}</dd>
                </div>
                <div className="closet-info-item">
                  <dt>المدينة</dt>
                  <dd>{user.city}</dd>
                </div>
              </dl>
            ) : (
              <div className="closet-edit-form">
                <label className="closet-field">
                  <span>الاسم</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </label>
                <label className="closet-field">
                  <span>رقم الهاتف</span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </label>
                <label className="closet-field">
                  <span>البريد الإلكتروني</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>
                <label className="closet-field">
                  <span>المدينة</span>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </label>
                <label className="closet-field">
                  <span>رابط الصورة</span>
                  <input
                    type="url"
                    name="photo"
                    dir="ltr"
                    value={formData.photo}
                    onChange={handleChange}
                  />
                </label>
                <div className="closet-form-actions">
                  <button type="button" className="closet-primary-btn" onClick={handleSave}>
                    حفظ التغييرات
                  </button>
                  <button type="button" className="closet-ghost-btn" onClick={handleCancel}>
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </article>

          <article className="closet-tile closet-tile-style">
            <div className="closet-tile-head">
              <h3>توقيعكِ الجمالي</h3>
            </div>
            <p className="closet-tile-note">الخدمات الأكثر حضوراً في مفضلاتكِ</p>
            {topServices.length > 0 ? (
              <div className="closet-chips">
                {topServices.map((service) => (
                  <span key={service} className="closet-chip">{service}</span>
                ))}
              </div>
            ) : (
              <p className="closet-muted">احفظي صالوناتكِ المفضلة ليظهر أسلوبكِ هنا</p>
            )}
            <p className="closet-style-foot">✦ {user.city}</p>
          </article>

          <article className="closet-tile closet-tile-settings">
            <div className="closet-tile-head">
              <h3>إعدادات الحساب</h3>
            </div>
            <div className="closet-setting">
              <div>
                <h4>الإشعارات</h4>
                <p>استلام إشعارات العروض والمواعيد</p>
              </div>
              <label className="closet-switch">
                <input type="checkbox" defaultChecked />
                <span className="closet-slider" aria-hidden="true" />
              </label>
            </div>
            <div className="closet-setting">
              <div>
                <h4>اللغة</h4>
                <p>العربية</p>
              </div>
              <button type="button" className="closet-ghost-btn closet-lang-btn">
                العربية
              </button>
            </div>
            <button type="button" className="closet-logout-btn">
              تسجيل الخروج
            </button>
          </article>
        </div>
      </section>

      <section className="closet-section" aria-labelledby="closet-heading-favorites">
        <div className="closet-section-heading">
          <span className="closet-section-index" dir="ltr" aria-hidden="true"></span>
          <h2 id="closet-heading-favorites">
            <span className="closet-section-en" dir="ltr">MY FAVORITES</span>
            <span className="closet-section-ar">مفضلاتي</span>
          </h2>
          <span className="closet-section-rule" aria-hidden="true" />
        </div>

        {savedSalons.length > 0 ? (
          <div className="closet-magazine">
            {savedSalons.map((salon, index) => (
              <article
                key={salon.id}
                className={[
                  "closet-fav",
                  salon.id === removingId ? "is-removing" : "",
                  salon.id === pulseId ? "is-new" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="closet-fav-photo">
                  <img src={salon.image} alt={salon.name} loading="lazy" />
                  <span className="closet-fav-gradient" aria-hidden="true" />
                  <span className="closet-fav-index" dir="ltr">
                    N° {String(index + 1).padStart(2, "0")}
                  </span>
                  <HeartButton
                    filled
                    label={`إزالة ${salon.name} من المفضلة`}
                    onClick={() => removeSalon(salon.id)}
                  />
                </div>
                <div className="closet-fav-caption">
                  <h3>{salon.name}</h3>
                  <p className="closet-fav-location">{salon.location}</p>
                  <div className="closet-fav-meta">
                    <span className="closet-fav-rating">
                      ⭐ {salon.rating} ({salon.reviewCount} تقييم)
                    </span>
                    <span className="closet-fav-services">
                      {salon.services.slice(0, 2).join(" • ")}
                    </span>
                  </div>
                  <p className="closet-fav-hours">
                    🕒 {salon.hours} · 💰 {salon.priceRange}
                  </p>
                  <Link to={`/salons/${salon.id}`} className="closet-view-btn">
                    عرض
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="closet-empty">
            <span aria-hidden="true">♡</span>
            <p>لا توجد صالونات محفوظة حالياً</p>
          </div>
        )}

        {railSalons.length > 0 ? (
          <div className="closet-rail-wrap">
            <p className="closet-rail-title">
              أضيفي إلى خزانتكِ
              <span dir="ltr">
                {activeTag?.label} · +{railSalons.length}
              </span>
            </p>
            <div className="closet-rail">
              {railSalons.map((salon) => (
                <div
                  key={salon.id}
                  className={`closet-rail-item${salon.id === pulseId ? " is-added" : ""}`}
                >
                  <img src={salon.image} alt={salon.name} loading="lazy" />
                  <span className="closet-rail-name">{salon.name}</span>
                  <HeartButton
                    filled={salon.id === pulseId}
                    label={`حفظ ${salon.name} في المفضلة`}
                    onClick={() => addSalon(salon.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="closet-rail-empty">
            لا صالونات مقترحة لأسلوب {activeTag?.label} حالياً
          </p>
        )}
      </section>

      <section className="closet-section" aria-labelledby="closet-heading-appointments">
        <div className="closet-section-heading">
          <span className="closet-section-index" dir="ltr" aria-hidden="true"></span>
          <h2 id="closet-heading-appointments">
            <span className="closet-section-en" dir="ltr">MY APPOINTMENTS</span>
            <span className="closet-section-ar">مواعيدي</span>
          </h2>
          <span className="closet-section-rule" aria-hidden="true" />
        </div>

        <div className="closet-bento closet-bento-appts">
          <article className="closet-tile closet-tile-form">
            <div className="closet-tile-head">
              <h3>موعد جديد</h3>
            </div>
            <div className="closet-form">
              <label className="closet-field">
                <span>الصالون</span>
                <select
                  name="salonId"
                  value={apptForm.salonId}
                  onChange={handleApptChange}
                >
                  <option value="" disabled>اختاري الصالون</option>
                  {salons.map((salon) => (
                    <option key={salon.id} value={salon.id}>{salon.name}</option>
                  ))}
                </select>
              </label>
              <label className="closet-field">
                <span>الخدمة</span>
                <select
                  name="service"
                  value={apptForm.service}
                  onChange={handleApptChange}
                  disabled={!selectedSalon}
                >
                  <option value="" disabled>
                    {selectedSalon ? "اختاري الخدمة" : "اختاري الصالون أولاً"}
                  </option>
                  {selectedSalon &&
                    selectedSalon.services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                </select>
              </label>
              <div className="closet-field-row">
                <label className="closet-field">
                  <span>التاريخ</span>
                  <input
                    type="date"
                    name="date"
                    value={apptForm.date}
                    onChange={handleApptChange}
                  />
                </label>
                <label className="closet-field">
                  <span>الوقت</span>
                  <input
                    type="time"
                    name="time"
                    value={apptForm.time}
                    onChange={handleApptChange}
                  />
                </label>
              </div>
              {apptError && (
                <p className="closet-form-error" role="alert">يرجى إكمال جميع الحقول</p>
              )}
              <div className="closet-form-actions">
                <button
                  type="button"
                  className="closet-primary-btn closet-save-appt"
                  onClick={handleApptSave}
                >
                  حفظ الموعد
                  <span
                    className={`closet-check${apptSaved ? " is-visible" : ""}`}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                </button>
              </div>
            </div>
          </article>

          <article className="closet-tile closet-tile-list">
            <div className="closet-tile-head">
              <h3>مواعيدي القادمة</h3>
              <span className="closet-tile-count" dir="ltr">{appointments.length}</span>
            </div>
            {sortedAppointments.length > 0 ? (
              <ul className="closet-appts">
                {sortedAppointments.map((appt) => {
                  const parts = apptDateParts(appt.date);
                  return (
                    <li
                      key={appt.id}
                      className={`closet-appt${appt.id === cancelingId ? " is-removing" : ""}`}
                    >
                      <div className="closet-appt-date">
                        <strong>{parts.day}</strong>
                        <span>{parts.month}</span>
                      </div>
                      <div className="closet-appt-info">
                        <strong>{appt.salonName}</strong>
                        <span>{appt.service}</span>
                        <small>{parts.weekday} · 🕒 {apptTimeLabel(appt.time)}</small>
                      </div>
                      <button
                        type="button"
                        className="closet-appt-cancel"
                        onClick={() => cancelAppointment(appt.id)}
                      >
                        إلغاء
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="closet-empty closet-empty-compact">
                <span aria-hidden="true">✧</span>
                <p>لا مواعيد بعد — أضيفي موعدكِ الأول من هنا</p>
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}

export default Profile;
