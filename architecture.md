# 🧱 Architecture Overview - B2B Tender Management Platform

This document explains the backend architecture and flow of the B2B Tender Management Platform project, including authentication, API design, and Supabase storage integration.

---

## 1. 🔀 High-Level Architecture

* **Frontend**: Next.js + TypeScript + Tailwind CSS
* **Backend**: Node.js + Express.js
* **Database**: PostgreSQL (via Supabase)
* **File Storage**: Supabase Storage (for logo uploads)
* **Auth**: JWT-based Authentication

---

## 2. 🔐 Authentication Flow

1. User registers or logs in via:

   * `POST /auth/register`
   * `POST /auth/login`

2. Backend generates a **JWT** and returns it to the client

3. Client stores token in `localStorage`

4. For protected routes, token is sent via `Authorization: Bearer <token>`

5. A custom `auth` middleware verifies the token and attaches `req.user` (includes `id`, `email`, etc.)

---

## 3. 🚚 API Route Overview

### 🔑 Authentication

* `POST /auth/register`: Register user
* `POST /auth/login`: Login user

### 💼 Company

* `POST /company`: Create company profile (auth required)
* `GET /company`: Get current user's company info (auth)
* `PUT /company`: Update company profile (auth)
* `POST /company/logo`: Upload logo to Supabase (auth)
* `GET /companies/:id`: Public view of company profile
* `GET /company/search?q=...`: Search for companies

### 📣 Tender

* `POST /tenders`: Create tender (auth)
* `GET /tenders`: View all tenders (paginated)
* `GET /tenders/my`: View my company's tenders
* `PUT /tenders/:id`: Update tender (auth)
* `DELETE /tenders/:id`: Delete tender (auth)

### 📎 Applications

* `POST /applications/:tenderId`: Apply to tender (auth)
* `GET /applications/:tenderId`: View applications for my tender (auth)
* `GET /applications/my`: View tenders I've applied to (auth)

---

## 4. 📁 File Uploads (Supabase Storage)

* Users can upload logos when managing company profiles
* Uses `multer` to read files in-memory
* File uploaded to Supabase via:

  ```js
  supabase.storage.from(bucket).upload(filename, fileBuffer, { contentType })
  ```
* `getPublicUrl` is used to retrieve shareable logo URLs
* URL is saved in `companies.logo_url`

---

## 5. 📂 Folder Structure (Backend)

```
backend/
├── index.js                # Express app entry point
├── db.js                   # PostgreSQL pool setup
├── supabase.js             # Supabase SDK config
├── middleware/
│   └── auth.js             # JWT auth middleware
├── routes/
│   ├── auth.js             # /auth endpoints
│   ├── company.js          # /company endpoints
│   ├── tender.js           # /tenders endpoints
│   └── application.js      # /applications endpoints
└── migrations/             # Optional SQL schema files
```

---

## 6. 🔁 Data Flow (Frontend → Backend)

* Frontend makes API requests using Axios via `/services/api.ts`
* All authenticated routes include `Authorization: Bearer <token>`
* Responses are handled with error states and loading indicators
* Role-based conditions handled on frontend (e.g. show Edit/Delete for own tenders only)

---

## 7. ✨ Highlights

* Uses **JWT** for stateless secure auth
* Clean modular structure for Express routes
* Full support for **tender management lifecycle**
* Integrates Supabase storage for logo uploads
* Tailwind-based responsive UI on frontend

---
