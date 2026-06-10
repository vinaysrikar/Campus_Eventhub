# Campus EventHub 🎉

> A full-stack college event management platform built with the MERN stack — enabling students to discover and register for campus events while giving organizers complete control over event management.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

🌐 **Live Demo:** [campus-eventhub.netlify.app](https://campus-eventhub.netlify.app)

---

## 📌 About The Project

Campus EventHub solves the problem of scattered event information across college campuses. Students no longer need to check notice boards or multiple group chats — everything is in one place.

Organizers get a dedicated dashboard to create, manage, and track events. Participants can register instantly without creating an account.

---

## ✨ Features

### 👨‍💼 Organizer
- Secure login and signup with JWT authentication
- Create, edit, and delete campus events
- Dashboard to view and manage all events
- Track participant count per event in real-time
- Download participant data as Excel/CSV sheet
- Department-based role access control

### 🧑‍🎓 Participant
- No account required — instant registration
- Simple event registration form
- Email confirmation with QR Code after registration
- Browse all upcoming campus events

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) |
| Email Service | Nodemailer |
| Image Storage | Cloudinary |
| Deployment (Frontend) | Netlify |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/vinaysrikar/Campus_Eventhub.git
cd Campus_Eventhub
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
DB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

```bash
npm start
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
Campus_Eventhub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
└── README.md
```

---

## 🔑 Key Technical Highlights

- **JWT Authentication** — secure token-based auth with role-checking middleware on all protected routes
- **OTP Email Verification** — Nodemailer integration for institutional email validation
- **Cloudinary Integration** — multipart/form-data image uploads with optimized URL storage
- **Role-Based Access** — separate access levels for students, organizers, and departments
- **TypeScript Frontend** — fully typed React components with Vite for fast builds

---

## 📊 Use Case

```
Student visits site
      ↓
Browses upcoming events
      ↓
Registers with name + email
      ↓
Receives email confirmation + QR code
      ↓
Attends event — QR scanned at entry
```

---

## 🔮 Future Improvements

- [ ] Event search and filters by category
- [ ] QR-based event check-in system
- [ ] Admin panel for full platform control
- [ ] Push notifications for upcoming events
- [ ] Mobile app version

---

## 👨‍💻 Author

**Vinay Srikar**
- GitHub: [@vinaysrikar](https://github.com/vinaysrikar)
- LinkedIn: [linkedin.com/in/vinay-srikar](https://linkedin.com/in/vinay-srikar)

---

⭐ If you found this project useful, please consider giving it a star!
