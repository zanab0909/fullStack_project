import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faWallet,
  faMoneyBillWave,
  faShieldHalved,
  faCheck,
  faArrowLeft,
  faCalendarCheck,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("full");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    document.title = "Payment — GLOW";
  }, []);

  const paymentOptions = [
    {
      id: "full",
      title: "Pay in Full",
      description: "Pay the complete service price now.",
      icon: faCreditCard,
      amount: 45000,
    },
    {
      id: "deposit",
      title: "Pay Deposit",
      description: "Secure your booking with a partial payment.",
      icon: faWallet,
      amount: 15000,
    },
    {
      id: "after",
      title: "Pay After Service",
      description: "Pay directly at the salon after your appointment.",
      icon: faMoneyBillWave,
      amount: 0,
    },
  ];

  const selectedOption = paymentOptions.find(
    (option) => option.id === paymentMethod
  );

  const handlePayment = () => {
    setPaid(true);
  };

  if (paid) {
    return (
      <main className="min-h-screen bg-[#f7f1e6] px-5 pb-20 pt-32 text-[#302720] sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full border border-[#302720]/15 bg-[#eee2d2] p-8 text-center sm:p-14"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center bg-[#302720] text-2xl text-[#dfcba9]">
              <FontAwesomeIcon icon={faCheck} />
            </div>

            <span className="mt-8 block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#8a6a43]">
              Payment Successful
            </span>

            <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">
              YOU'RE ALL SET.
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#302720]/55">
              Your booking payment has been recorded. Your appointment at
              Glow Beauty Studio is now secured.
            </p>

            <div className="mx-auto mt-8 max-w-md border border-[#302720]/10 bg-[#f7f1e6] p-5 text-left">
              <div className="flex items-center justify-between border-b border-[#302720]/10 pb-4">
                <span className="text-xs text-[#302720]/45">
                  Payment Method
                </span>

                <span className="text-xs font-semibold">
                  {selectedOption.title}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-[#302720]/45">
                  Amount
                </span>

                <span className="font-display text-xl font-semibold">
                  {selectedOption.amount === 0
                    ? "At Salon"
                    : `${selectedOption.amount.toLocaleString()} IQD`}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/client-dashboard"
                className="bg-[#302720] px-7 py-4 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#f7f1e6]"
              >
                My Dashboard
              </Link>

              <Link
                to="/notifications"
                className="border border-[#302720]/15 px-7 py-4 text-[9px] font-extrabold uppercase tracking-[0.16em]"
              >
                Notifications
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e6] px-5 pb-20 pt-32 text-[#302720] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <section className="border-b border-[#302720]/15 pb-10">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#8a6a43]" />

            <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#8a6a43]">
              Secure Checkout
            </span>
          </div>

          <h1 className="mt-6 font-display text-6xl font-semibold tracking-[-0.06em] sm:text-8xl">
            PAYMENT
          </h1>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <div className="mb-7">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#8a6a43]">
                Choose Payment
              </span>

              <h2 className="mt-3 font-display text-3xl font-semibold">
                How would you like to pay?
              </h2>
            </div>

            <div className="space-y-4">
              {paymentOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setPaymentMethod(option.id)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`flex w-full items-start gap-5 border p-5 text-left transition ${
                    paymentMethod === option.id
                      ? "border-[#8a6a43] bg-[#eee2d2]"
                      : "border-[#302720]/15 hover:border-[#8a6a43]/50"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center ${
                      paymentMethod === option.id
                        ? "bg-[#302720] text-[#dfcba9]"
                        : "bg-[#e9dcc8] text-[#8a6a43]"
                    }`}
                  >
                    <FontAwesomeIcon icon={option.icon} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <h3 className="font-display text-xl font-semibold">
                        {option.title}
                      </h3>

                      <span className="font-display text-lg font-semibold">
                        {option.amount === 0
                          ? "At Salon"
                          : `${option.amount.toLocaleString()} IQD`}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#302720]/50">
                      {option.description}
                    </p>
                  </div>

                  <div
                    className={`mt-1 h-4 w-4 rounded-full border ${
                      paymentMethod === option.id
                        ? "border-[#8a6a43] bg-[#8a6a43]"
                        : "border-[#302720]/25"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <aside>
            <div className="border border-[#302720]/15 bg-[#eee2d2] p-7">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8a6a43]">
                Booking Summary
              </span>

              <h2 className="mt-4 font-display text-3xl font-semibold">
                Glow Beauty Studio
              </h2>

              <div className="mt-6 space-y-4 border-y border-[#302720]/10 py-5">
                <SummaryRow
                  icon={faCalendarCheck}
                  label="Service"
                  value="Full Makeup"
                />

                <SummaryRow
                  icon={faCalendarCheck}
                  label="Date"
                  value="October 09, 2026"
                />

                <SummaryRow
                  icon={faCreditCard}
                  label="Time"
                  value="06:30 PM"
                />
              </div>

              <div className="flex items-end justify-between pt-6">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#302720]/45">
                  Amount
                </span>

                <span className="font-display text-3xl font-semibold">
                  {selectedOption.amount === 0
                    ? "At Salon"
                    : `${selectedOption.amount.toLocaleString()} IQD`}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                className="mt-7 flex h-14 w-full items-center justify-center gap-3 bg-[#302720] text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#f7f1e6] transition hover:bg-[#8a6a43]"
              >
                {selectedOption.amount === 0
                  ? "Confirm Booking"
                  : "Confirm Payment"}

                <FontAwesomeIcon icon={faArrowLeft} />
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.13em] text-[#302720]/35">
                <FontAwesomeIcon icon={faLock} />
                Secure GLOW Checkout
              </div>
            </div>

            <div className="mt-5 flex gap-4 border border-[#302720]/10 p-5">
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="text-lg text-[#8a6a43]"
              />

              <p className="text-xs leading-5 text-[#302720]/45">
                Your payment information is handled securely. You can choose
                full payment, a deposit, or payment after your service.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

const SummaryRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4">
      <FontAwesomeIcon
        icon={icon}
        className="w-4 text-[#8a6a43]"
      />

      <div className="flex flex-1 items-center justify-between gap-4">
        <span className="text-xs text-[#302720]/45">
          {label}
        </span>

        <span className="text-xs font-semibold">
          {value}
        </span>
      </div>
    </div>
  );
};

export default Payment;