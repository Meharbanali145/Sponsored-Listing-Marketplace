# ⚡ AdFlow Pro — Sponsored Listing Marketplace

> A full-stack MERN application built as a term project. AdFlow Pro is a classified advertising platform where clients post sponsored listings, moderators review content, admins verify payments and schedule publishing, and a super admin manages the entire platform.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Axios, Lucide React, Vite |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Scheduler | node-cron (auto publish/expire ads) |
| Validation | express-validator |
| Dev Tools | nodemon, concurrently |

---

## 🗂️ Project Structure

```
AdFlow-Pro/
├── backend/                  # Express API server
│   ├── server.js             # Entry point
│   ├── app.js                # Re-exports src/app
│   ├── .env.example          # Environment variable template
│   ├── API_COLLECTION.md     # All API endpoints documented
│   └── src/
│       ├── app.js            # Express app, CORS, routes
│       ├── config.js         # Reads .env variables
│       ├── db.js             # MongoDB connection
│       ├── models/index.js   # All Mongoose schemas in one file
│       ├── middleware/auth.js # JWT verification, role guard
│       ├── routes/           # One file per role
│       │   ├── auth.routes.js
│       │   ├── public.routes.js
│       │   ├── client.routes.js
│       │   ├── moderator.routes.js
│       │   ├── admin.routes.js
│       │   ├── super.routes.js
│       │   ├── health.routes.js
│       │   └── cron.routes.js
│       ├── services/
│       │   └── workflow.js   # Status transitions + audit log
│       ├── utils/
│       │   ├── media.js      # URL normalizer (YouTube + images)
│       │   └── ranking.js    # Ad rank score formula
│       ├── cron/jobs.js      # Scheduled tasks
│       └── seed.js           # Database seeder
│
├── frontend/                 # React SPA
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── utils/api.js      # Axios instance with JWT interceptor
│       └── pages/            # One component per page/role
│
└── package.json              # Root scripts (install:all, dev, seed)
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18 or later
- A MongoDB database (free at [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/AdFlow-Pro.git
cd AdFlow-Pro
```

### 2. Install all dependencies

```bash
npm run install:all
```

This runs `npm install` in both `backend/` and `frontend/` folders.

### 3. Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` and fill in:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/adflow_pro
JWT_SECRET=<your-random-secret>
PORT=5000
CLIENT_URL=http://localhost:5173
CRON_ENABLED=true
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```
The default value works for local development:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the database

```bash
npm run seed
```

This creates demo users, packages, categories, cities, and 18 sample ads.

**Seeded login credentials (password for all: `password123`)**

| Role | Email |
|---|---|
| Client | client@adflow.test |
| Moderator | moderator@adflow.test |
| Admin | admin@adflow.test |
| Super Admin | super@adflow.test |

### 5. Start development servers

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173) concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔑 Role Guide

| Role | What they can do |
|---|---|
| **Client** | Register, post ads, submit for review, upload payment proof |
| **Moderator** | Review the moderation queue, approve/reject/flag listings |
| **Admin** | Verify payments, publish/schedule ads, boost rank, view analytics |
| **Super Admin** | All admin actions + manage users, packages, categories, cities, learning questions |

---

## 📢 Ad Lifecycle

```
draft → submitted → under_review → payment_pending
     → payment_submitted → payment_verified
     → scheduled / published → expired
```

Each transition is recorded in `AdStatusHistory` and an `AuditLog`. The client receives a `Notification` at each step.

---

## 🧠 Key Features

- **Media Normalization** — Accepts YouTube URLs (extracts thumbnail) and direct image URLs (validates format). Invalid URLs get a fallback placeholder.
- **Rank Score Engine** — `rankScore = featured(50) + packageWeight×10 + freshnessPoints + adminBoost + verifiedSeller(10)`
- **Scheduled Jobs (node-cron)** — Auto-publishes scheduled ads every hour, expires ads daily, sends 48h expiry reminders, and logs a DB heartbeat every 20 minutes.
- **Duplicate Detection** — Flags ads sharing a seller phone number that is already in an active listing.
- **Learning Question Widget** — Homepage shows a random backend concept Q&A pulled from the database.
- **Password Reset Flow** — Token-based reset (token returned in API for demo; in production, send via email with a service like SendGrid or Nodemailer).

---

## 🌐 Deployment Guide

### Option 1 — Render (Recommended, Free Tier)

> Render can host both the backend API and serve the frontend as a static site for free.

#### Step 1 — Deploy the Backend

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
4. Add environment variables (from your `.env`):
   - `MONGODB_URI` ← your Atlas connection string
   - `JWT_SECRET` ← your secret
   - `CLIENT_URL` ← your frontend URL (add after deploying frontend)
   - `CRON_ENABLED` = `true`
5. Deploy → copy the URL e.g. `https://adflow-pro-api.onrender.com`

#### Step 2 — Deploy the Frontend

1. Go to Render → **New Static Site**
2. Connect the same GitHub repository
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://adflow-pro-api.onrender.com/api`
5. Deploy → copy the frontend URL
6. Go back to your **backend** service → update `CLIENT_URL` to the frontend URL → redeploy

#### Step 3 — Seed Production Database

After both services are running, open Render's **Shell** tab on your backend service:
```bash
node src/seed.js
```

---

### Option 2 — Railway

1. Create a new project at [railway.app](https://railway.app)
2. Add a service from GitHub → select your repo → set root to `backend`
3. Add variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT=5000`
4. For frontend: add another service, root = `frontend`, build = `npm run build`, output = `dist`

---

### Option 3 — Vercel (Frontend) + Render (Backend)

1. Deploy backend on Render (see above)
2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
3. Framework: **Vite**, Root Directory: `frontend`
4. Add env var: `VITE_API_URL=https://your-render-backend.onrender.com/api`
5. Deploy

---

## 🔗 External Services You Need to Set Up

> These are the only external links you need to configure. Everything else is handled by the project itself.

| Service | Purpose | Link | Free? |
|---|---|---|---|
| **MongoDB Atlas** | Cloud database | https://cloud.mongodb.com | ✅ Yes (512MB free) |
| **Render** | Backend + frontend hosting | https://render.com | ✅ Yes (sleeps after 15min inactivity on free tier) |
| **Vercel** | Frontend hosting (alternative) | https://vercel.com | ✅ Yes |
| **Railway** | Full-stack hosting (alternative) | https://railway.app | ✅ $5 free credit |

> **Note on Render free tier:** The backend service sleeps after 15 minutes of inactivity. The first request after sleep takes ~30 seconds. For a resume project this is fine. To keep it awake, use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your API every 10 minutes.

---

## 📦 API Reference

See [`backend/API_COLLECTION.md`](backend/API_COLLECTION.md) for the full list of endpoints, request bodies, and example responses.

---

## 👤 Author

Built as a term project for the Backend Web Development course.

---

## 📄 License

MIT — free to use, share, and modify.
