import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import Salons from "./pages/Salons";
import SalonProfile from "./pages/SalonProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Notifications from "./pages/Notifications";
import ClientDashboard from "./pages/ClientDashboard";
import SalonDashboard from "./pages/SalonDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7f1e6]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/services" element={<Services />} />

          <Route path="/bookings" element={<Bookings />} />

          <Route path="/salons" element={<Salons />} />

          <Route
            path="/salons/:slug"
            element={<SalonProfile />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/client-dashboard"
            element={<ClientDashboard />}
          />

          <Route
            path="/salon-dashboard"
            element={<SalonDashboard />}
          />

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

          <Route path="/payment" element={<Payment />} />

          <Route
            path="/notifications"
            element={<Notifications />}
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;