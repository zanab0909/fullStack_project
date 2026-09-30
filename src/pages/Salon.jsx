import { useState } from "react";
import SalonCard from "../cpmponents/SalonCard";
import salons from "../data/salons";

function Salons() {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const services = [...new Set(salons.flatMap((salon) => salon.services))];
  const areas = [...new Set(salons.map((salon) => salon.location.replace("البصرة - ", "")))];
  const filteredSalons = salons
    .filter((salon) => {
      const searchableText = [salon.name, salon.location, ...salon.services]
        .join(" ")
        .toLowerCase();

      return (
        searchableText.includes(search.toLowerCase()) &&
        (!serviceFilter || salon.services.includes(serviceFilter)) &&
        (!areaFilter || salon.location.includes(areaFilter)) &&
        (!ratingFilter || salon.rating >= Number(ratingFilter))
      );
    })
    .sort((firstSalon, secondSalon) => {
      if (sortBy === "name") return firstSalon.name.localeCompare(secondSalon.name);
      return secondSalon.rating - firstSalon.rating;
    });

  return (
    <div className="salons-page">
  <div className="salons-header">
    <h1>صالوناتنا</h1>

    <p>
      اكتشفي أفضل الصالونات وخدمات التجميل القريبة منك
    </p>
  </div>

  <div className="search-box">
    <input
      type="text"
      placeholder="ابحثي عن صالون أو خدمة أو منطقة..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div className="filters-bar">
    <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
      <option value="">كل الخدمات</option>
      {services.map((service) => <option key={service} value={service}>{service}</option>)}
    </select>

    <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
      <option value="">كل المناطق</option>
      {areas.map((area) => <option key={area} value={area}>{area}</option>)}
    </select>

    <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
      <option value="">كل التقييمات</option>
      <option value="4.8">4.8 فأعلى</option>
      <option value="4.5">4.5 فأعلى</option>
    </select>

    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="rating">الأعلى تقييماً</option>
      <option value="name">حسب الاسم</option>
    </select>
  </div>

  <p className="results-count">عرض {filteredSalons.length} من {salons.length} صالونات</p>

  <div className="salons-grid">
    {filteredSalons.length > 0 ? (
      filteredSalons.map((salon) => (
        <SalonCard
          key={salon.id}
          salon={salon}
        />
      ))
    ) : (
      <p>لم يتم العثور على صالون.</p>
    )}
  </div>

</div>
); }
export default Salons;