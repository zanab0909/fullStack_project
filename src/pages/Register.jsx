import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCheck,
  faCircleExclamation,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("client");
  const [salonName, setSalonName] = useState("");
  const [salonAddress, setSalonAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await apiCall("/auth/register", "POST", {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: accountType,
        phone: phone.trim(),
        salon_name: accountType === "salon" ? salonName.trim() : undefined,
        salon_address: accountType === "salon" ? salonAddress.trim() : undefined,
      });

      if (result.token) {
        localStorage.setItem("glow_token", result.token);
      }

      if (result.data) {
        localStorage.setItem("glow_user", JSON.stringify(result.data));
      }

      navigate(accountType === "salon" ? "/salon-dashboard" : "/client-dashboard");
    } catch (error) {
      setError(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="glow-page min-h-[calc(100vh-120px)] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-[1250px] overflow-hidden rounded-[20px] border border-[#302720]/10 bg-[#f5eee4] shadow-[0_25px_70px_rgba(48,39,32,0.1)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-7 sm:p-12 lg:p-16">
          <div className="max-w-[570px]">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9a7444]">
              Join GLOW
            </div>

            <h1 className="mt-3 font-display text-[48px] leading-[0.98] tracking-[-0.05em] text-[#302720] sm:text-[58px]">
              Create your
              <span className="block text-[#9a7444]">beauty profile.</span>
            </h1>

            <p className="mt-5 text-[14px] leading-7 text-[#302720]/50">
              {accountType === "salon"
                ? "Create a salon owner account and bring your business onto GLOW."
                : "Save your favourite salons, manage bookings and keep all your beauty appointments in one place."}
            </p>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <fieldset>
                <legend className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                  Account type
                </legend>
                <div className="grid grid-cols-2 gap-2 rounded-[10px] border border-[#302720]/10 bg-[#eee5d8]/55 p-1.5">
                  {[
                    ["client", "Client", faUser],
                    ["salon", "Salon", faStore],
                  ].map(([value, label, icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setAccountType(value);
                        setError("");
                      }}
                      aria-pressed={accountType === value}
                      className={`flex h-11 items-center justify-center gap-2 rounded-[8px] text-[10px] font-extrabold uppercase tracking-[0.08em] transition-colors ${
                        accountType === value
                          ? "bg-[#302720] text-[#f5eee4]"
                          : "text-[#302720]/55 hover:bg-[#dfcba9]/45"
                      }`}
                    >
                      <FontAwesomeIcon icon={icon} />
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                    First name
                  </span>

                  <div className="flex h-[55px] items-center gap-3 rounded-[10px] border border-[#302720]/12 bg-[#eee5d8]/55 px-4 focus-within:border-[#9a7444]">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[11px] text-[#9a7444]"
                    />

                    <input
                      required
                      type="text"
                      value={firstName}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        setError("");
                      }}
                      placeholder="Your name"
                      className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#302720]/30"
                    />
                  </div>
                </label>

                <label>
                  <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                    Last name
                  </span>

                  <div className="flex h-[55px] items-center gap-3 rounded-[10px] border border-[#302720]/12 bg-[#eee5d8]/55 px-4 focus-within:border-[#9a7444]">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[11px] text-[#9a7444]"
                    />

                    <input
                      required
                      type="text"
                      value={lastName}
                      onChange={(event) => {
                        setLastName(event.target.value);
                        setError("");
                      }}
                      placeholder="Last name"
                      className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#302720]/30"
                    />
                  </div>
                </label>
              </div>

              {accountType === "salon" && (
                <div className="space-y-5 rounded-[12px] border border-[#302720]/10 bg-[#eee5d8]/35 p-4">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                      Salon name
                    </span>
                    <input
                      required
                      type="text"
                      value={salonName}
                      onChange={(event) => setSalonName(event.target.value)}
                      placeholder="Your salon or studio name"
                      className="h-[50px] w-full rounded-[9px] border border-[#302720]/12 bg-[#f5eee4] px-4 text-[13px] outline-none placeholder:text-[#302720]/30 focus:border-[#9a7444]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                      Salon address
                    </span>
                    <input
                      required
                      type="text"
                      value={salonAddress}
                      onChange={(event) => setSalonAddress(event.target.value)}
                      placeholder="Street, city"
                      className="h-[50px] w-full rounded-[9px] border border-[#302720]/12 bg-[#f5eee4] px-4 text-[13px] outline-none placeholder:text-[#302720]/30 focus:border-[#9a7444]"
                    />
                  </label>
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                  Email address
                </span>

                <div className="flex h-[55px] items-center gap-3 rounded-[10px] border border-[#302720]/12 bg-[#eee5d8]/55 px-4 focus-within:border-[#9a7444]">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-[11px] text-[#9a7444]"
                  />

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#302720]/30"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                  Phone number
                </span>
                <div className="flex h-[55px] items-center gap-3 rounded-[10px] border border-[#302720]/12 bg-[#eee5d8]/55 px-4 focus-within:border-[#9a7444]">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#302720]/30"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#302720]/55">
                  Password
                </span>

                <div className="flex h-[55px] items-center gap-3 rounded-[10px] border border-[#302720]/12 bg-[#eee5d8]/55 px-4 focus-within:border-[#9a7444]">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-[11px] text-[#9a7444]"
                  />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Create a password"
                    className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#302720]/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#302720]/40 hover:text-[#9a7444]"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </label>

              <label className="flex items-start gap-3 pt-1">
                <input
                  required
                  type="checkbox"
                  className="mt-1 accent-[#9a7444]"
                />

                <span className="text-[11px] leading-5 text-[#302720]/50">
                  I agree to the GLOW terms and understand that my account
                  information will be used to manage my bookings.
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-3 rounded-[9px] border border-[#915959]/20 bg-[#915959]/8 px-4 py-3 text-[11px] font-semibold text-[#915959]">
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="text-[12px]"
                  />

                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[10px] border border-[#76552f]/35 bg-[#9a7444] text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#fffaf2] shadow-[0_10px_28px_rgba(118,85,47,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#76552f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[10px]"
                />
              </button>
            </form>

            <div className="mt-7 text-center">
              <span className="text-[12px] text-[#302720]/45">
                Already have an account?
              </span>

              <Link
                to="/login"
                className="ml-2 text-[12px] font-extrabold text-[#9a7444]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[680px] lg:block">
          <img
            src="/images/makeup-export.jpg"
            alt="GLOW beauty"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#302720]/80 via-[#302720]/15 to-transparent" />

          <div className="absolute bottom-12 left-10 right-10">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#dfcba9]">
              <FontAwesomeIcon icon={faCheck} />
              Beauty made simple
            </div>

            <h2 className="mt-4 font-display text-[48px] leading-[0.98] text-[#f5eee4]">
              One profile.
              <span className="block text-[#dfcba9]">
                Endless possibilities.
              </span>
            </h2>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;