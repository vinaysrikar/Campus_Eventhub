# EventHub — Full Stack Setup Guide

## Project Structure

```
event-hub-central-main/     ← your existing React frontend
backend/                    ← new Express backend (drop this folder next to frontend)
```

---

## Step 1 — Set up the Backend

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Copy .env.example and fill in your values
cp .env.example .env
```

### Fill in `.env`:

| Variable | What to put |
|---|---|
| `MONGO_URI` | `mongodb://localhost:27017/eventhub` (local) |
| `JWT_SECRET` | Any long random string |
| `CLOUDINARY_*` | Free account at https://cloudinary.com |
| `EMAIL_*` | Gmail + App Password (see note below) |

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

---

## Step 2 — Start MongoDB

Make sure MongoDB is installed and running:
```bash
# Windows
mongod

# Mac (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

## Step 3 — Seed the Database

This populates MongoDB with all events, organizers, and user accounts:
```bash
npm run seed
```

Output:
```
✅ Created 13 users
✅ Created 30 organizers
✅ Created 12 events
🎉 Seed complete!
─────────────────────────────────────────
Login credentials (all organizers): Password@123
Admin: admin@university.edu / Admin@123
─────────────────────────────────────────
```

---

## Step 4 — Start the Backend

```bash
npm run dev
# Server running at http://localhost:5000
```

Test it:
```
GET http://localhost:5000/api/health  →  { "status": "ok" }
GET http://localhost:5000/api/events  →  [ ...12 events ]
```

---

## Step 5 — Update the Frontend

Copy these files from `frontend-changes/` into your React project:

| Source (frontend-changes/) | Destination (event-hub-central-main/) |
|---|---|
| `src/lib/api.ts` | `src/lib/api.ts` ← NEW FILE |
| `src/lib/auth-context.tsx` | `src/lib/auth-context.tsx` ← REPLACE |
| `src/pages/Index.tsx` | `src/pages/Index.tsx` ← REPLACE |
| `src/pages/Login.tsx` | `src/pages/Login.tsx` ← REPLACE |
| `src/pages/Dashboard.tsx` | `src/pages/Dashboard.tsx` ← REPLACE |
| `src/components/RegistrationModal.tsx` | `src/components/RegistrationModal.tsx` ← REPLACE |
| `src/components/StatsBar.tsx` | `src/components/StatsBar.tsx` ← REPLACE |
| `.env` | `.env` ← NEW FILE (in frontend root) |

Then install axios in the frontend:
```bash
cd event-hub-central-main
npm install axios
```

---

## Step 6 — Start the Frontend

```bash
cd event-hub-central-main
npm run dev
# Frontend at http://localhost:8080
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register organizer |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get current user |

### Events
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/events | No | Get all events (filter by dept, status, search) |
| GET | /api/events/:id | No | Get single event |
| GET | /api/events/stats | No | Get platform stats |
| POST | /api/events | Yes | Create event |
| PUT | /api/events/:id | Yes | Update event |
| DELETE | /api/events/:id | Yes | Delete event |

### Registrations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/registrations | No | Register for event |
| GET | /api/registrations/event/:id | Yes | Get event's registrations |

### Upload
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/upload/event-image | Yes | Upload event image |

---

## Deploy to Cloud (Later)

### Backend → Railway
1. Push `backend/` to a GitHub repo
2. Create new project on https://railway.app
3. Add env variables in Railway dashboard
4. Add MongoDB via Railway's MongoDB plugin or use MongoDB Atlas (free tier)

### Frontend → Vercel
1. Push `event-hub-central-main/` to GitHub
2. Import on https://vercel.com
3. Set env variable: `VITE_API_URL=https://your-railway-backend.up.railway.app/api`

---

## Demo Login Credentials

| Email | Password | Dept |
|---|---|---|
| priya.cse@university.edu | Password@123 | CSE |
| suresh.ece@university.edu | Password@123 | ECE |
| arun.mech@university.edu | Password@123 | MECH |
| admin@university.edu | Admin@123 | All (Admin) |
