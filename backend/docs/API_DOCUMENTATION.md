# Glow Salon Booking — Backend API Documentation

Welcome to the **Glow Backend API Documentation**. This document provides everything frontend developers need to integrate with the Glow RESTful API seamlessly.

---

## 1. General API Conventions

### Base URL
```
http://localhost:3000/api
```

### Standard Response Envelope
All API endpoints (except the simple health check `/api/test`) return consistent JSON structures:

#### Success Response
```json
{
  "success": true,
  "message": "Optional human-readable confirmation message",
  "count": 2, // Included when returning lists
  "data": { ... } // Object or Array containing the payload
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Clear explanation of why the request failed"
}
```

### Common HTTP Status Codes
| Code | Meaning | Description |
|---|---|---|
| `200 OK` | Success | The request succeeded (GET, PUT, PATCH, DELETE). |
| `201 Created` | Created | A new resource was created successfully (POST). |
| `400 Bad Request` | Validation Error | Missing fields, invalid formats, or illegal business rules. |
| `401 Unauthorized` | Authentication Error | Missing or invalid/expired JWT token or wrong credentials. |
| `403 Forbidden` | Authorization Error | Valid user, but insufficient permissions (e.g. customer trying to access admin endpoint or another customer's booking). |
| `404 Not Found` | Not Found | Requested resource (salon, service, booking) does not exist. |
| `409 Conflict` | Conflict | Duplicate resource (e.g. email already registered). |
| `500 Server Error` | Server Error | Internal server error. |

---

## 2. Authentication & Authorization

### User Roles
- **`customer`**: Regular user who can browse salons/services, make bookings, view their own bookings, and cancel their own pending bookings.
- **`admin`**: System administrator who can manage salons, services, view all bookings across the platform, and update any booking status.

### JWT Header Format
For all protected routes, include the JWT token in the `Authorization` HTTP header:
```http
Authorization: Bearer <JWT_TOKEN>
```
If the header is missing, the API returns `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## 3. Endpoints Reference

---

### 🟢 System Health Check

#### `GET /api/test`
Verifies that the backend server is running and accessible.

- **Access:** Public (No token required)
- **Headers:** None
- **Success Response (`200 OK`):**
```json
{
  "message": "Glow backend is working"
}
```

---

### 🔐 Authentication Endpoints

#### `POST /api/auth/register`
Creates a new customer account.

- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "full_name": "Sara Ahmed",
  "email": "sara@example.com",
  "password": "secretPassword123",
  "phone": "0501234567" // Optional
}
```
- **Validation Rules:**
  - `full_name`: Required (string).
  - `email`: Required, valid email format, must be unique in DB.
  - `password`: Required, minimum 6 characters. Stored securely as bcrypt hash.
  - Role defaults to `'customer'`.
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "id": 1,
    "full_name": "Sara Ahmed",
    "email": "sara@example.com",
    "phone": "0501234567",
    "role": "customer"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "full_name, email, and password are required." }`
  - `400 Bad Request`: `{ "success": false, "message": "Please provide a valid email address." }`
  - `400 Bad Request`: `{ "success": false, "message": "Password must be at least 6 characters long." }`
  - `409 Conflict`: `{ "success": false, "message": "This email is already registered. Please use a different email." }`

---

#### `POST /api/auth/login`
Authenticates a user (customer or admin) and returns a signed JWT token valid for 7 days.

- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "sara@example.com",
  "password": "secretPassword123"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "full_name": "Sara Ahmed",
    "email": "sara@example.com",
    "phone": "0501234567",
    "role": "customer" // or "admin"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "Email and password are required." }`
  - `401 Unauthorized`: `{ "success": false, "message": "Invalid email or password." }`

---

### 🏪 Salon Endpoints

#### `GET /api/salons`
Returns a list of all registered salons sorted from newest to oldest.

- **Access:** Public
- **Headers:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Glow Salon Riyadh",
      "address": "King Fahd Road, Riyadh",
      "phone": "0112345678",
      "email": "riyadh@glow.com",
      "created_at": "2026-09-28T14:24:21.000Z"
    }
  ]
}
```

---

#### `GET /api/salons/:id`
Returns full details of a single salon by ID.

- **Access:** Public
- **Path Parameters:** `id` (integer)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Glow Salon Riyadh",
    "address": "King Fahd Road, Riyadh",
    "phone": "0112345678",
    "email": "riyadh@glow.com",
    "created_at": "2026-09-28T14:24:21.000Z"
  }
}
```
- **Error Response:**
  - `404 Not Found`: `{ "success": false, "message": "Salon not found." }`

---

#### `POST /api/salons`
Creates a new salon.

- **Access:** Admin only (`role === 'admin'`)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Request Body:**
```json
{
  "name": "Glow Salon Khobar",
  "address": "Corniche Road, Khobar",
  "phone": "0138887766", // Optional
  "email": "khobar@glow.com" // Optional
}
```
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Salon created successfully.",
  "data": {
    "id": 3,
    "name": "Glow Salon Khobar",
    "address": "Corniche Road, Khobar",
    "phone": "0138887766",
    "email": "khobar@glow.com"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "name and address are required." }`
  - `401 Unauthorized`: Missing or invalid token
  - `403 Forbidden`: User is not an admin

---

#### `PUT /api/salons/:id`
Updates an existing salon's details.

- **Access:** Admin only
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Path Parameters:** `id` (integer)
- **Request Body:**
```json
{
  "name": "Glow Salon Khobar Premium",
  "address": "Prince Turki Street, Khobar",
  "phone": "0138887766",
  "email": "khobar@glow.com"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Salon updated successfully.",
  "data": {
    "id": 3,
    "name": "Glow Salon Khobar Premium",
    "address": "Prince Turki Street, Khobar",
    "phone": "0138887766",
    "email": "khobar@glow.com"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "name and address are required." }`
  - `404 Not Found`: `{ "success": false, "message": "Salon not found." }`

---

#### `DELETE /api/salons/:id`
Deletes a salon and cascades deletion to all its services and bookings.

- **Access:** Admin only
- **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Path Parameters:** `id` (integer)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Salon deleted successfully."
}
```
- **Error Response:**
  - `404 Not Found`: `{ "success": false, "message": "Salon not found." }`

---

### 💅 Service Endpoints

#### `GET /api/services`
Returns all services across all salons, including the salon name.

- **Access:** Public
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "salon_id": 1,
      "salon_name": "Glow Salon Riyadh",
      "name": "Haircut & Blowdry",
      "description": "Haircut with blowdry finish",
      "duration_minutes": 60,
      "price": "100.00",
      "created_at": "2026-09-28T14:35:35.000Z"
    }
  ]
}
```

---

#### `GET /api/services/salon/:salonId`
Returns all services belonging specifically to the requested salon.

- **Access:** Public
- **Path Parameters:** `salonId` (integer)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "salon": "Glow Salon Riyadh",
  "count": 2,
  "data": [
    {
      "id": 1,
      "salon_id": 1,
      "name": "Haircut & Blowdry",
      "description": "Haircut with blowdry finish",
      "duration_minutes": 60,
      "price": "100.00",
      "created_at": "2026-09-28T14:35:35.000Z"
    }
  ]
}
```
- **Error Response:**
  - `404 Not Found`: `{ "success": false, "message": "Salon not found." }`

---

#### `GET /api/services/:id`
Returns a single service by ID with its salon name.

- **Access:** Public
- **Path Parameters:** `id` (integer)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "salon_id": 1,
    "salon_name": "Glow Salon Riyadh",
    "name": "Haircut & Blowdry",
    "description": "Haircut with blowdry finish",
    "duration_minutes": 60,
    "price": "100.00",
    "created_at": "2026-09-28T14:35:35.000Z"
  }
}
```
- **Error Response:**
  - `404 Not Found`: `{ "success": false, "message": "Service not found." }`

---

#### `POST /api/services`
Adds a new service to an existing salon.

- **Access:** Admin only
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Request Body:**
```json
{
  "salon_id": 1,
  "name": "HydraFacial Treatment",
  "description": "Deep skin cleansing and hydration", // Optional
  "duration_minutes": 45,
  "price": 180.00
}
```
- **Validation Rules:**
  - `salon_id`, `name`, `duration_minutes`, `price`: Required.
  - `duration_minutes` and `price` must be positive numbers (> 0).
  - Referenced `salon_id` must exist in MySQL.
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Service created successfully.",
  "data": {
    "id": 4,
    "salon_id": 1,
    "name": "HydraFacial Treatment",
    "description": "Deep skin cleansing and hydration",
    "duration_minutes": 45,
    "price": 180
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "salon_id, name, duration_minutes, and price are required." }`
  - `400 Bad Request`: `{ "success": false, "message": "duration_minutes and price must be positive numbers." }`
  - `404 Not Found`: `{ "success": false, "message": "Salon not found. Cannot create a service for a non-existent salon." }`

---

#### `PUT /api/services/:id`
Updates an existing service's details.

- **Access:** Admin only
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Path Parameters:** `id` (integer)
- **Request Body:**
```json
{
  "name": "HydraFacial Deluxe",
  "description": "Extended treatment with vitamin mask",
  "duration_minutes": 60,
  "price": 220.00
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Service updated successfully.",
  "data": {
    "id": 4,
    "name": "HydraFacial Deluxe",
    "description": "Extended treatment with vitamin mask",
    "duration_minutes": 60,
    "price": 220
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Missing fields or non-positive numbers
  - `404 Not Found`: `{ "success": false, "message": "Service not found." }`

---

#### `DELETE /api/services/:id`
Deletes a service from the database.

- **Access:** Admin only
- **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Path Parameters:** `id` (integer)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Service deleted successfully."
}
```
- **Error Response:**
  - `404 Not Found`: `{ "success": false, "message": "Service not found." }`

---

### 📅 Booking Endpoints

#### `POST /api/bookings`
Creates a reservation for a service at a specific salon.

- **Access:** Customer or Admin (Protected)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
```json
{
  "salon_id": 1,
  "service_id": 1,
  "booking_date": "2026-11-15", // Format: YYYY-MM-DD
  "booking_time": "14:30",      // Format: HH:MM
  "notes": "Prefer window seating" // Optional
}
```
- **Key Business & Security Rules:**
  - `user_id` is automatically extracted from the JWT token (cannot be forged or injected in the request body).
  - `booking_date` and `booking_time` must be a valid future date and time.
  - The `salon_id` must exist.
  - The `service_id` must exist **AND must belong to the specified salon**.
  - Default initial status is `'pending'`.
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Booking created successfully.",
  "data": {
    "id": 5,
    "user_id": 1,
    "salon_id": 1,
    "service_id": 1,
    "booking_date": "2026-11-15",
    "booking_time": "14:30",
    "status": "pending",
    "notes": "Prefer window seating"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "salon_id, service_id, booking_date, and booking_time are required." }`
  - `400 Bad Request`: `{ "success": false, "message": "booking_date must be in YYYY-MM-DD format (e.g. 2026-10-15)." }`
  - `400 Bad Request`: `{ "success": false, "message": "booking_time must be in HH:MM format (e.g. 14:30)." }`
  - `400 Bad Request`: `{ "success": false, "message": "Booking date and time must be a valid future date and time." }`
  - `404 Not Found`: `{ "success": false, "message": "Salon not found." }`
  - `404 Not Found`: `{ "success": false, "message": "Service not found or does not belong to the selected salon." }`

---

#### `GET /api/bookings/my`
Retrieves all bookings made by the currently authenticated customer, sorted from newest to oldest.

- **Access:** Customer or Admin (Protected)
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 5,
      "booking_date": "2026-11-14T21:00:00.000Z",
      "booking_time": "14:30:00",
      "status": "pending",
      "notes": "Prefer window seating",
      "created_at": "2026-09-28T15:00:00.000Z",
      "salon_name": "Glow Salon Riyadh",
      "salon_address": "King Fahd Road, Riyadh",
      "service_name": "Haircut & Blowdry",
      "service_price": "100.00",
      "duration_minutes": 60
    }
  ]
}
```

---

#### `GET /api/bookings/:id`
Retrieves full details for a specific booking.

- **Access:** Protected (Allowed only to the booking owner, or an admin)
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters:** `id` (integer)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "user_id": 1,
    "booking_date": "2026-11-14T21:00:00.000Z",
    "booking_time": "14:30:00",
    "status": "pending",
    "notes": "Prefer window seating",
    "created_at": "2026-09-28T15:00:00.000Z",
    "customer_name": "Sara Ahmed",
    "customer_email": "sara@example.com",
    "salon_name": "Glow Salon Riyadh",
    "salon_address": "King Fahd Road, Riyadh",
    "service_name": "Haircut & Blowdry",
    "service_price": "100.00",
    "duration_minutes": 60
  }
}
```
- **Error Responses:**
  - `403 Forbidden`: `{ "success": false, "message": "Access denied. You can only view your own bookings." }`
  - `404 Not Found`: `{ "success": false, "message": "Booking not found." }`

---

#### `PATCH /api/bookings/:id/cancel`
Allows a customer to cancel their own reservation.

- **Access:** Protected (Allowed only to the booking owner)
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Path Parameters:** `id` (integer)
- **Business Rule:** Only bookings currently in `'pending'` status can be cancelled.
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully."
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "Cannot cancel a booking with status 'confirmed'. Only pending bookings can be cancelled." }`
  - `403 Forbidden`: `{ "success": false, "message": "Access denied. You can only cancel your own bookings." }`
  - `404 Not Found`: `{ "success": false, "message": "Booking not found." }`

---

#### `GET /api/bookings`
Returns every booking in the entire system with customer, salon, and service details.

- **Access:** Admin only
- **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 5,
      "booking_date": "2026-11-14T21:00:00.000Z",
      "booking_time": "14:30:00",
      "status": "confirmed",
      "notes": "Customer notes",
      "created_at": "2026-09-28T15:00:00.000Z",
      "customer_id": 1,
      "customer_name": "Sara Ahmed",
      "customer_email": "sara@example.com",
      "salon_id": 1,
      "salon_name": "Glow Salon Riyadh",
      "service_id": 1,
      "service_name": "Haircut & Blowdry",
      "service_price": "100.00",
      "duration_minutes": 60
    }
  ]
}
```
- **Error Response:**
  - `403 Forbidden`: `{ "success": false, "message": "Access denied. Admins only." }`

---

#### `PATCH /api/bookings/:id/status`
Updates the status of any booking.

- **Access:** Admin only
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Path Parameters:** `id` (integer)
- **Request Body:**
```json
{
  "status": "confirmed" // Allowed values: 'pending', 'confirmed', 'completed', 'cancelled'
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Booking status updated to 'confirmed'.",
  "data": {
    "id": 5,
    "status": "confirmed"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "status is required." }`
  - `400 Bad Request`: `{ "success": false, "message": "Invalid status. Allowed values: pending, confirmed, completed, cancelled." }`
  - `404 Not Found`: `{ "success": false, "message": "Booking not found." }`

---

## 4. Frontend Integration Examples (JavaScript / TypeScript)

Here are reusable helper functions using modern `fetch` that you can directly copy into your React, Vue, Angular, or vanilla JS application:

### API Client Setup
```javascript
const API_BASE = 'http://localhost:3000/api';

// Helper for making API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}
```

---

### Example 1: User Registration
```javascript
async function registerUser(fullName, email, password, phone) {
  try {
    const res = await apiCall('/auth/register', 'POST', {
      full_name: fullName,
      email,
      password,
      phone,
    });
    console.log('Registration success:', res.data);
    return res.data;
  } catch (error) {
    console.error('Registration error:', error.message);
    alert(error.message);
  }
}
```

---

### Example 2: User Login & Token Storage
```javascript
async function loginUser(email, password) {
  try {
    const res = await apiCall('/auth/login', 'POST', { email, password });
    
    // Store token and user data in localStorage
    localStorage.setItem('glow_token', res.token);
    localStorage.setItem('glow_user', JSON.stringify(res.data));
    
    console.log(`Welcome back, ${res.data.full_name}! (Role: ${res.data.role})`);
    return res;
  } catch (error) {
    console.error('Login error:', error.message);
    alert(error.message);
  }
}
```

---

### Example 3: Browse Salons & Services
```javascript
// Fetch all salons
async function fetchSalons() {
  const res = await apiCall('/salons');
  return res.data; // Array of salons
}

// Fetch services offered by a specific salon
async function fetchServicesBySalon(salonId) {
  const res = await apiCall(`/services/salon/${salonId}`);
  return res.data; // Array of services
}
```

---

### Example 4: Create a Booking
```javascript
async function bookAppointment(salonId, serviceId, date, time, notes = '') {
  const token = localStorage.getItem('glow_token');
  if (!token) throw new Error('Please log in first');

  const res = await apiCall(
    '/bookings',
    'POST',
    {
      salon_id: salonId,
      service_id: serviceId,
      booking_date: date, // 'YYYY-MM-DD'
      booking_time: time, // 'HH:MM'
      notes,
    },
    token
  );

  alert('Appointment booked successfully!');
  return res.data;
}
```

---

### Example 5: View My Bookings & Cancel
```javascript
// Get list of logged-in customer's bookings
async function fetchMyBookings() {
  const token = localStorage.getItem('glow_token');
  const res = await apiCall('/bookings/my', 'GET', null, token);
  return res.data;
}

// Cancel a booking
async function cancelBooking(bookingId) {
  const token = localStorage.getItem('glow_token');
  const res = await apiCall(`/bookings/${bookingId}/cancel`, 'PATCH', {}, token);
  alert(res.message);
  return res;
}
```

---

### Example 6: Admin Operations
```javascript
// Admin fetches all bookings across the platform
async function fetchAllBookingsAdmin() {
  const token = localStorage.getItem('glow_token');
  const res = await apiCall('/bookings', 'GET', null, token);
  return res.data;
}

// Admin confirms a booking
async function confirmBooking(bookingId) {
  const token = localStorage.getItem('glow_token');
  const res = await apiCall(
    `/bookings/${bookingId}/status`,
    'PATCH',
    { status: 'confirmed' },
    token
  );
  return res.data;
}

// Admin creates a new salon
async function createNewSalon(name, address, phone, email) {
  const token = localStorage.getItem('glow_token');
  const res = await apiCall(
    '/salons',
    'POST',
    { name, address, phone, email },
    token
  );
  return res.data;
}
```

---

## 5. Summary of Data Types for Frontend Models

```typescript
export type UserRole = 'customer' | 'admin';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}

export interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  created_at: string; // ISO date string
}

export interface Service {
  id: number;
  salon_id: number;
  salon_name?: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: string | number;
  created_at: string;
}

export interface Booking {
  id: number;
  user_id?: number;
  salon_id?: number;
  service_id?: number;
  booking_date: string; // ISO or 'YYYY-MM-DD'
  booking_time: string; // 'HH:MM:SS'
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  salon_name: string;
  salon_address?: string;
  service_name: string;
  service_price: string;
  duration_minutes: number;
  customer_name?: string;
  customer_email?: string;
}
```
