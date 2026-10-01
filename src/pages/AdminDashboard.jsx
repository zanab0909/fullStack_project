import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStore,
  faChartLine,
  faPlus,
  faTrash,
  faUserPlus,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

import { apiCall } from "../api";

const getMonthlyRegistrations = (accounts, today) => {
  return Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    const count = accounts.filter((account) => {
      if (!account.created_at) return false;
      const createdAt = new Date(account.created_at);
      return createdAt.getMonth() === month && createdAt.getFullYear() === year;
    }).length;

    return {
      label: monthDate.toLocaleString("en", { month: "short" }),
      count,
    };
  });
};

function RegistrationChart({ data }) {
  const maxValue = Math.max(1, ...data.map((month) => month.count));
  const points = data.map((month, index) => {
    const x = 36 + (index * 328) / (data.length - 1);
    const y = 136 - (month.count / maxValue) * 100;
    return { ...month, x, y };
  });

  return (
    <svg viewBox="0 0 400 184" className="mt-5 w-full" role="img" aria-label="New client and salon accounts by month">
      {[36, 86, 136].map((y) => (
        <line key={y} x1="28" x2="374" y1={y} y2={y} stroke="#302720" strokeOpacity=".1" strokeDasharray="3 5" />
      ))}
      <polyline
        points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="#9a7444"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map(({ label, count, x, y }) => (
        <g key={label}>
          <circle cx={x} cy={y} r="4" fill="#f5eee4" stroke="#9a7444" strokeWidth="3" />
          <text x={x} y="166" textAnchor="middle" fill="#302720" fillOpacity=".55" fontSize="10">{label}</text>
          <text x={x} y={Math.max(18, y - 10)} textAnchor="middle" fill="#76552f" fontSize="9" fontWeight="700">{count}</text>
        </g>
      ))}
    </svg>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [today] = useState(() => new Date());
  const [clients, setClients] = useState([]);
  const [salons, setSalons] = useState([]);
  const [clientForm, setClientForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [salonForm, setSalonForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const registrationData = getMonthlyRegistrations([...clients, ...salons], today);
  const recentAccounts = [...clients, ...salons].filter((account) => {
    if (!account.created_at) return false;
    const createdAt = new Date(account.created_at);
    return today.getTime() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  const stats = [
    ["Client accounts", String(clients.length), faUsers],
    ["Salon accounts", String(salons.length), faStore],
    ["Joined in 30 days", String(recentAccounts), faChartLine],
    ["Total accounts", String(clients.length + salons.length), faBuilding],
  ];

  useEffect(() => {
    let active = true;
    const loadAdminData = async () => {
      const token = localStorage.getItem("glow_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [clientsResult, salonsResult] = await Promise.all([
          apiCall("/admin/users", "GET", null, token),
          apiCall("/salons", "GET"),
        ]);
        if (!active) return;
        setClients(
          Array.isArray(clientsResult?.data)
            ? clientsResult.data.filter((user) => user.role === "client")
            : []
        );
        setSalons(Array.isArray(salonsResult?.data) ? salonsResult.data : []);
      } catch (loadError) {
        if (active) setError(loadError.message || "Failed to load admin data.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAdminData();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleClientSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("glow_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const result = await apiCall(
        "/admin/users",
        "POST",
        {
          ...clientForm,
          role: "client",
        },
        token
      );

      setClients((currentClients) => [
        { ...result.data, created_at: new Date().toISOString() },
        ...currentClients,
      ]);
      setClientForm({ full_name: "", email: "", password: "", phone: "" });
      setSuccess("Client account added successfully.");
    } catch (submitError) {
      setError(submitError.message || "Could not add client account.");
    }
  };

  const handleDeleteClient = async (clientId) => {
    const token = localStorage.getItem("glow_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiCall(`/admin/users/${clientId}`, "DELETE", null, token);
      setClients((currentClients) =>
        currentClients.filter((client) => client.id !== clientId)
      );
      setSuccess("Client account deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete client account.");
    }
  };

  const handleSalonSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("glow_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const result = await apiCall("/salons", "POST", salonForm, token);
      setSalons((currentSalons) => [
        { ...result.data, created_at: new Date().toISOString() },
        ...currentSalons,
      ]);
      setSalonForm({ name: "", address: "", phone: "", email: "" });
      setSuccess("Salon account added successfully.");
    } catch (submitError) {
      setError(submitError.message || "Could not add salon account.");
    }
  };

  const handleDeleteSalon = async (salonId) => {
    const token = localStorage.getItem("glow_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setSuccess("");

      await apiCall(`/salons/${salonId}`, "DELETE", null, token);
      setSalons((currentSalons) =>
        currentSalons.filter((salon) => salon.id !== salonId)
      );
      setSuccess("Salon account deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete salon account.");
    }
  };

  return (
    <main className="glow-page min-h-screen px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
      <div className="mx-auto grid max-w-[1500px] items-start gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[15px] border border-[#302720]/10 bg-[#f5eee4] p-3">
          <div className="px-3 pb-4 pt-2">
            <div className="font-display text-[27px] leading-none text-[#302720]">GLOW</div>
            <div className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9a7444]">Admin navigation</div>
          </div>
          <nav aria-label="Admin dashboard sections" className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            {[
              ["Statistics", "#analytics", faChartLine],
              ["Client Management", "#clients", faUsers],
              ["Salon Management", "#salons", faStore],
            ].map(([label, href, icon]) => (
              <a
                key={href}
                href={href}
                className="flex min-h-11 items-center justify-center gap-2 rounded-[9px] border border-[#302720]/8 px-2 py-2 text-center text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#76552f] transition-colors hover:bg-[#dfcba9]/55 sm:gap-3 sm:text-[10px] lg:justify-start lg:px-3 lg:text-left"
              >
                <FontAwesomeIcon icon={icon} className="shrink-0" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
        <section className="rounded-[20px] border border-[#302720]/10 bg-[#e1d3c0] p-7 sm:p-10 lg:p-12">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#76552f]">
                GLOW administration
              </div>

              <h1 className="mt-3 font-display text-[48px] leading-none tracking-[-0.05em] text-[#302720] sm:text-[60px]">
                Platform overview.
              </h1>

              <p className="mt-4 max-w-[650px] text-[14px] leading-7 text-[#302720]/50">
                Monitor the GLOW marketplace, salons, clients and booking
                activity from one workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("glow_token");
                localStorage.removeItem("glow_user");
                navigate("/login");
              }}
              className="inline-flex h-[50px] items-center justify-center rounded-[10px] border border-[#76552f]/30 bg-transparent px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#76552f] transition-all hover:bg-[#f5eee4]"
            >
              Logout
            </button>
          </div>
        </section>

        <section id="analytics" className="mt-7 scroll-mt-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, icon]) => (
            <div
              key={label}
              className="rounded-[15px] border border-[#302720]/10 bg-[#f5eee4] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                <FontAwesomeIcon icon={icon} />
              </div>

              <div className="mt-5 font-display text-[34px] text-[#302720]">
                {value}
              </div>

              <div className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/35">
                {label}
              </div>
            </div>
          ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-6 sm:p-8">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">Account activity</div>
              <h2 className="mt-2 font-display text-[30px] text-[#302720]">Registrations over time</h2>
              <p className="mt-1 text-[11px] text-[#302720]/45">New client and salon accounts by month</p>
              <RegistrationChart data={registrationData} />
            </div>

            <div className="rounded-[17px] border border-[#302720]/10 bg-[#e1d3c0] p-6 sm:p-8">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#76552f]">Account mix</div>
              <h2 className="mt-2 font-display text-[30px] text-[#302720]">Managed accounts</h2>
              <div className="mt-8 space-y-7">
                {[
                  ["Clients", clients.length, "#9a7444"],
                  ["Salons", salons.length, "#61745b"],
                ].map(([label, count, color]) => {
                  const total = clients.length + salons.length;
                  const share = total ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-[#302720]">{label}</span>
                        <span className="text-[#302720]/55">{count} <span className="ml-1 text-[9px]">{share}%</span></span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#f5eee4]/70">
                        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${share}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 border-t border-[#302720]/10 pt-4 text-[10px] text-[#302720]/45">Account totals update when records are added or removed.</div>
            </div>
          </div>
        </section>

        {(error || success) && (
          <div className="mt-6 rounded-[12px] border border-[#302720]/10 bg-[#f5eee4] px-5 py-4">
            {error ? (
              <div className="text-[13px] text-[#8a3d30]">{error}</div>
            ) : (
              <div className="text-[13px] text-[#3d5b3b]">{success}</div>
            )}
          </div>
        )}

        <section id="clients" className="mt-9 scroll-mt-6">
          <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>

              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
                  Client accounts
                </div>
                <h2 className="mt-2 font-display text-[30px] text-[#302720]">
                  Manage clients
                </h2>
              </div>
            </div>

            <form onSubmit={handleClientSubmit} className="mt-6 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="full_name"
                  value={clientForm.full_name}
                  onChange={(event) =>
                    setClientForm({ ...clientForm, full_name: event.target.value })
                  }
                  placeholder="Full name"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={clientForm.email}
                  onChange={(event) =>
                    setClientForm({ ...clientForm, email: event.target.value })
                  }
                  placeholder="Email"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="password"
                  name="password"
                  value={clientForm.password}
                  onChange={(event) =>
                    setClientForm({ ...clientForm, password: event.target.value })
                  }
                  placeholder="Password"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={clientForm.phone}
                  onChange={(event) =>
                    setClientForm({ ...clientForm, phone: event.target.value })
                  }
                  placeholder="Phone"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-[48px] items-center gap-3 rounded-[10px] bg-[#9a7444] px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#fffaf2] transition-colors hover:bg-[#76552f]"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add client
              </button>
            </form>

            <div className="mt-8 space-y-3">
              {loading ? (
                <div className="text-[13px] text-[#302720]/45">Loading clients...</div>
              ) : clients.length === 0 ? (
                <div className="rounded-[10px] border border-[#302720]/10 bg-[#eee5d8]/60 p-4 text-[12px] text-[#302720]/45">
                  No clients found.
                </div>
              ) : (
                clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between gap-3 rounded-[12px] border border-[#302720]/8 bg-[#eee5d8]/50 p-4"
                  >
                    <div>
                      <div className="text-[12px] font-extrabold text-[#302720]">
                        {client.full_name}
                      </div>
                      <div className="mt-1 text-[10px] text-[#302720]/40">
                        {client.email}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteClient(client.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f0dad2] text-[#8a3d30] transition-colors hover:bg-[#e9c7be]"
                      aria-label={`Delete ${client.full_name}`}
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-[12px]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        <section id="salons" className="mt-6 scroll-mt-6 pb-16">
          <div className="rounded-[17px] border border-[#302720]/10 bg-[#f5eee4] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfcba9]/55 text-[#9a7444]">
                <FontAwesomeIcon icon={faBuilding} />
              </div>

              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a7444]">
                  Salon accounts
                </div>
                <h2 className="mt-2 font-display text-[30px] text-[#302720]">
                  Manage salons
                </h2>
              </div>
            </div>

            <form onSubmit={handleSalonSubmit} className="mt-6 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  value={salonForm.name}
                  onChange={(event) =>
                    setSalonForm({ ...salonForm, name: event.target.value })
                  }
                  placeholder="Salon name"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={salonForm.email}
                  onChange={(event) =>
                    setSalonForm({ ...salonForm, email: event.target.value })
                  }
                  placeholder="Salon email"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  name="address"
                  value={salonForm.address}
                  onChange={(event) =>
                    setSalonForm({ ...salonForm, address: event.target.value })
                  }
                  placeholder="Address"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={salonForm.phone}
                  onChange={(event) =>
                    setSalonForm({ ...salonForm, phone: event.target.value })
                  }
                  placeholder="Phone"
                  className="h-[48px] rounded-[10px] border border-[#302720]/10 bg-[#fffaf2] px-4 text-[12px] text-[#302720] outline-none placeholder:text-[#302720]/30"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-[48px] items-center gap-3 rounded-[10px] bg-[#9a7444] px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#fffaf2] transition-colors hover:bg-[#76552f]"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add salon
              </button>
            </form>

            <div className="mt-8 space-y-3">
              {loading ? (
                <div className="text-[13px] text-[#302720]/45">Loading salons...</div>
              ) : salons.length === 0 ? (
                <div className="rounded-[10px] border border-[#302720]/10 bg-[#eee5d8]/60 p-4 text-[12px] text-[#302720]/45">
                  No salons found.
                </div>
              ) : (
                salons.map((salon) => (
                  <div
                    key={salon.id}
                    className="flex items-center justify-between gap-3 rounded-[12px] border border-[#302720]/8 bg-[#eee5d8]/50 p-4"
                  >
                    <div>
                      <div className="text-[12px] font-extrabold text-[#302720]">
                        {salon.name}
                      </div>
                      <div className="mt-1 text-[10px] text-[#302720]/40">
                        {salon.address}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSalon(salon.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f0dad2] text-[#8a3d30] transition-colors hover:bg-[#e9c7be]"
                      aria-label={`Delete ${salon.name}`}
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-[12px]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;