# 🌸 GLOW - Full-Stack Salon Booking Platform

A modern full-stack web application designed for browsing salons, discovering beauty services, and booking appointments online.

---

## 🏗️ Project Architecture

This repository contains both the **Frontend** and the **Backend**:

```text
├── backend/                   # Node.js & Express REST API
│   ├── docs/                  # API Documentation
│   ├── src/
│   │   ├── config/            # MySQL Database connection pool (db.js)
│   │   ├── controllers/       # Business logic (auth, salon, service, booking)
│   │   ├── middleware/        # JWT Authentication & role protection
│   │   └── routes/            # Express API endpoints
│   ├── database_schema.sql    # Complete MySQL Database Schema
│   ├── seed_all.js            # Seeder for salons & 26+ beauty services
│   ├── server.js              # Express server entry point with CORS
│   └── package.json
│
├── src/                       # React 19 + Vite Frontend
│   ├── assets/                # Images & SVGs
│   ├── components/            # Reusable UI components (Navbar, Footer, GlowLogo)
│   ├── pages/                 # Application pages (Home, Salons, Bookings, Dashboard, etc.)
│   ├── api.js                 # Frontend API client
│   ├── App.jsx
│   └── main.jsx
│
├── public/                    # Static assets & gallery images
├── package.json
└── vite.config.js
```

---

## 🚀 How to Run the Project

### 1. Prerequisites
- **Node.js** (v18+)
- **MySQL Database Server**

### 2. Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Copy `.env.example` to `.env` and configure your database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=glow_db
   JWT_SECRET=glow_super_secret_key_2024
   JWT_EXPIRES_IN=7d
   ```
4. Import database schema & seed data:
   ```bash
   node seed_all.js
   ```
   *(Or import `database_schema.sql` into MySQL).*
5. Start the backend API:
   ```bash
   npm start
   ```
   Server runs on: `http://localhost:3000`

---

### 3. Setup the Frontend
1. In a new terminal, navigate to the project root:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide & FontAwesome Icons.
- **Backend:** Node.js, Express.js, MySQL2 with connection pool, JWT Authentication, bcryptjs.
