import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import salons from "../data/salons";

function SalonDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState({ name: "", service: "", date: "", time: "" });
  const [bookingSent, setBookingSent] = useState(false);
  const [openSpecialist, setOpenSpecialist] = useState(null);
  const [reviewForm, setReviewForm] = useState({ author: "", rating: 5, text: "" });
  const [reviews, setReviews] = useState([]);
  const salon = salons.find((item) => item.id === Number(id));

  if (!salon) {
    return (
      <div className="not-found">
        <h2>الصالون غير موجود</h2>
        <Link to="/salons">العودة إلى صالوناتنا</Link>
      </div>
    );
  }

  const mapUrl = salon.mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.mapQuery)}`
    : `https://www.google.com/maps/search/?api=1&query=${salon.latitude},${salon.longitude}`;
  const contactUrl = salon.whatsapp || salon.instagram || salon.facebook;
  const allReviews = [...salon.reviews, ...reviews];

  function handleBookingSubmit(event) {
    event.preventDefault();
    const message = `مرحباً، أرغب بحجز موعد في ${salon.name}. الاسم: ${booking.name}، الخدمة: ${booking.service}، التاريخ: ${booking.date}، الوقت: ${booking.time}`;
    const separator = contactUrl.includes("?") ? "&" : "?";
    window.open(`${contactUrl}${separator}text=${encodeURIComponent(message)}`, "_blank");
    setBookingSent(true);
  }

  function handleReviewSubmit(event) {
    event.preventDefault();
    setReviews([
      ...reviews,
      { ...reviewForm, date: "الآن" }
    ]);
    setReviewForm({ author: "", rating: 5, text: "" });
  }

  return (
    <div className="salon-details-page">
      <Link to="/salons" className="back-button">
        ← العودة إلى الصالونات
      </Link>

      <div className="salon-details">
        <div className="salon-cover">
          <img
            src={salon.image}
            alt={salon.name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/images/salon-fallback.svg";
            }}
          />
        </div>

        <div className="salon-info">
          <div className="salon-title">
            <div>
              <h1>{salon.name}</h1>
              <p>📍 {salon.location}</p>
            </div>

            <div className="rating">⭐ {salon.rating}</div>
          </div>

          <div className="details-section">
            <h2>نبذة عنا</h2>
            <p>{salon.description}</p>
            <div className="salon-meta-grid">
              <div><strong>ساعات العمل</strong><span>{salon.hours}</span></div>
              <div><strong>الأسعار</strong><span>{salon.priceRange}</span></div>
              <div><strong>التقييم</strong><span>⭐ {salon.rating} من {salon.reviewCount} تقييم</span></div>
            </div>
          </div>

          <div className="details-section">
            <h2>الخدمات</h2>

            <div className="services-list">
              {salon.services.map((service, index) => (
                <div className="service-item" key={index}>
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h2>المختصون</h2>

            <div className="specialists-list">
              {salon.specialists.map((specialist, index) => (
                <div className="specialist-item" key={index}>
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/images/salon-fallback.svg";
                    }}
                  />
                  <span>
                    <strong>{specialist.name}</strong>
                    <small>{specialist.role}</small>
                    <em>★ {salon.rating} · {salon.services[index % salon.services.length]}</em>
                  </span>
                  <button
                    type="button"
                    className="specialist-action"
                    onClick={() => setOpenSpecialist(openSpecialist === index ? null : index)}
                  >
                    {openSpecialist === index ? "إخفاء" : "الخدمات"}
                  </button>
                  {openSpecialist === index && (
                    <div className="specialist-details">
                      <p>{specialist.bio}</p>
                      <div>{specialist.services.map((service) => <span key={service}>{service}</span>)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="details-section reviews-section">
            <h2>آراء الزبائن</h2>
            <div className="review-summary">
              <div className="review-score">
                <strong>{salon.rating}</strong>
                <span className="review-stars">★★★★★</span>
                <small>{salon.reviewCount + reviews.length} تقييم</small>
              </div>
            </div>
            <div className="review-list">
              {allReviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="review-heading">
                    <span className="review-avatar">{review.author.charAt(0)}</span>
                    <strong>{review.author}</strong>
                    <small>{review.date}</small>
                  </div>
                  <span className="review-stars">{"★".repeat(Math.round(review.rating))}{"☆".repeat(5 - Math.round(review.rating))}</span>
                  <p>{review.text}</p>
                </div>
              ))}
            </div>
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>شاركي تجربتك</h3>
              <input
                type="text"
                placeholder="اسمك"
                value={reviewForm.author}
                onChange={(event) => setReviewForm({ ...reviewForm, author: event.target.value })}
                required
              />
              <div className="rating-picker" aria-label="اختاري تقييمك">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    type="button"
                    className={rating <= reviewForm.rating ? "active" : ""}
                    key={rating}
                    onClick={() => setReviewForm({ ...reviewForm, rating })}
                    aria-label={`${rating} نجوم`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="اكتبي رأيك عن تجربتك..."
                value={reviewForm.text}
                onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })}
                required
              />
              <button type="submit" className="review-submit">نشر التقييم</button>
            </form>
          </div>

          <div className="details-section">
            <h2>موقع الصالون</h2>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-button"
            >
              <span className="location-icon" aria-hidden="true">📍</span>
              عرض الموقع على Google Maps
            </a>
          </div>

          <div className="details-section">
            <h2>مواقع التواصل</h2>

            <div className="social-links">
              {salon.instagram && (
                <a
                  href={salon.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}

              <a
                href={salon.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>

              {salon.whatsapp && (
                <a
                  href={salon.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="details-section booking-section">
            <h2>احجزي موعدك</h2>
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={booking.name}
                onChange={(event) => setBooking({ ...booking, name: event.target.value })}
                required
              />
              <select
                value={booking.service}
                onChange={(event) => setBooking({ ...booking, service: event.target.value })}
                required
              >
                <option value="">اختاري الخدمة</option>
                {salon.services.map((service) => <option key={service} value={service}>{service}</option>)}
              </select>
              <div className="booking-row">
                <input type="date" value={booking.date} onChange={(event) => setBooking({ ...booking, date: event.target.value })} required />
                <input type="time" value={booking.time} onChange={(event) => setBooking({ ...booking, time: event.target.value })} required />
              </div>
              <button type="submit" className="booking-button">إرسال طلب الحجز</button>
              {bookingSent && <p className="booking-success">تم تجهيز طلب الحجز، أكدي الموعد عبر حساب الصالون.</p>}
            </form>
          </div>

          <div className="details-section">
            <h2>حجز الموعد</h2>
            {salon.phone ? <p>للحجز: {salon.phone}</p> : <p>للحجز، تواصلي عبر مواقع التواصل</p>}
            {salon.whatsapp ? (
              <a
                href={salon.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                💬 حجز عبر واتساب
              </a>
            ) : (
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                تواصل للحجز
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalonDetails;