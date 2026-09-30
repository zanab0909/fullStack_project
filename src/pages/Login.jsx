import { apiCall } from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUser,
  faStore,
  faShieldHalved,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const roles = [
    {
      id: "client",
      label: "Client",
      description: "Book & discover",
      icon: faUser,
      route: "/client-dashboard",
    },
    {
      id: "salon",
      label: "Salon",
      description: "Manage your salon",
      icon: faStore,
      route: "/salon-dashboard",
    },
    {
      id: "admin",
      label: "Admin",
      description: "Manage GLOW",
      icon: faShieldHalved,
      route: "/admin-dashboard",
    },
  ];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedRole) {
      setError("Please select an account type.");
      return;
    }

    try {
      const result = await apiCall("/auth/login", "POST", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("glow_token", result.token);
      localStorage.setItem("glow_user", JSON.stringify(result.data));

      setError("");

      const selected = roles.find((role) => role.id === selectedRole);

      if (selected) {
        navigate(selected.route);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    }
  };

  return (
    <main className="glow-page min-h-[calc(100vh-120px)] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-[1250px] overflow-hidden rounded-[20px] border border-[#302720]/10 bg-[#f5eee4] shadow-[0_25px_70px_rgba(48,39,32,0.1)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[700px] lg:block">
          <img
            src="/images/glow-hero.jpg.jpg"
            alt="GLOW beauty"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#302720]/80 via-[#302720]/20 to-transparent" />

          <div className="absolute bottom-12 left-10 right-10">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#dfcba9]">
              Welcome to GLOW
            </div>

            <h1 className="mt-4 font-display text-[56px] leading-[0.95] tracking-[-0.05em] text-[#f5eee4]">
              Your beauty
              <span className="block text-[#dfcba9]">starts here.</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center p-7 sm:p-12 lg:p-14">
          <div className="w-full max-w-[500px]">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9a7444]">
              GLOW Account
            </div>

            <h2 className="mt-3 font-display text-[48px] leading-none tracking-[-0.05em] text-[#302720]">
              Welcome back.
            </h2>

            <p className="mt-5 text-[14px] leading-7 text-[#302720]/50">
              Sign in to manage your appointments and discover your favourite
              beauty spaces.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/55">
                  Email address
                </span>

                <div className="flex h-[56px] items-center gap-3 rounded-[10px] border border-[#302720]/12 bg-[#eee5d8]/55 px-4 transition-all focus-within:border-[#9a7444] focus-within:bg-[#eee5d8]">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-[12px] text-[#9a7444]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-[13px] font-semibold text-[#302720] outline-none placeholder:text-[#302720]/30"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/55">
                  Password
                </span>

                <div className="flex h-[56px] items-center gap-3 rounded-[10px] border border-[#302720]/12 bg-[#eee5d8]/55 px-4 transition-all focus-within:border-[#9a7444] focus-within:bg-[#eee5d8]">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-[12px] text-[#9a7444]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-[13px] font-semibold text-[#302720] outline-none placeholder:text-[#302720]/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#302720]/40 transition-colors hover:text-[#9a7444]"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/55">
                    Sign in as
                  </span>

                  <span className="text-[9px] font-semibold text-[#9a7444]">
                    Choose your account type
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleChange(role.id)}
                        className={`group relative flex min-h-[94px] flex-col items-center justify-center rounded-[11px] border px-2 py-3 text-center transition-all duration-300 ${
                          isSelected
                            ? "border-[#9a7444]/60 bg-[#dfcba9]/45 shadow-[0_8px_22px_rgba(154,116,68,0.10)]"
                            : "border-[#302720]/10 bg-[#eee5d8]/40 hover:border-[#9a7444]/30 hover:bg-[#dfcba9]/20"
                        }`}
                      >
                        <span
                          className={`absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full transition-all ${
                            isSelected
                              ? "bg-[#9a7444]"
                              : "bg-[#302720]/10"
                          }`}
                        />

                        <div
                          className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                            isSelected
                              ? "bg-[#c5a477]/30 text-[#76552f]"
                              : "bg-[#302720]/5 text-[#302720]/40 group-hover:text-[#9a7444]"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={role.icon}
                            className="text-[12px]"
                          />
                        </div>

                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-[0.08em] ${
                            isSelected
                              ? "text-[#76552f]"
                              : "text-[#302720]/60"
                          }`}
                        >
                          {role.label}
                        </span>

                        <span
                          className={`mt-1 text-[8px] font-semibold ${
                            isSelected
                              ? "text-[#302720]/55"
                              : "text-[#302720]/30"
                          }`}
                        >
                          {role.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 rounded-[9px] border border-[#915959]/20 bg-[#915959]/8 px-4 py-3 text-[11px] font-semibold text-[#915959]">
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="text-[12px]"
                  />

                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#9a7444] transition-colors hover:text-[#76552f]"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="group flex h-[56px] w-full items-center justify-center gap-3 rounded-[10px] border border-[#9a7444]/50 bg-[#c5a477] text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#302720] shadow-[0_10px_28px_rgba(154,116,68,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9a7444] hover:bg-[#dfcba9] hover:shadow-[0_14px_32px_rgba(154,116,68,0.18)]"
              >
                Sign in as{" "}
                {roles.find((role) => role.id === selectedRole)?.label}

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[10px] transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-8 border-t border-[#302720]/10 pt-7 text-center">
              <span className="text-[12px] text-[#302720]/45">
                Don't have an account?
              </span>

              <Link
                to="/register"
                className="ml-2 text-[12px] font-extrabold text-[#9a7444] transition-colors hover:text-[#76552f]"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;