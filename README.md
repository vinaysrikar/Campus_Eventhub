# Campus EventHub 🎉

## 📌 About the Project

Campus EventHub is a fullstack web application that brings all campus events into one place.

It allows organizers to create and manage events, while participants can easily register without creating an account.

---

## 🚀 Features

### 👨‍💼 Organizer

* Organizer login and signup
* Create and manage events
* Dashboard to view all events
* View number of participants per event
* Download participant data as a sheet (Excel/CSV)
* Limited to 5 organizers (department-based access)

### 🧑‍🎓 Participant

* No account required
* Simple event registration form
* Enter details and submit
* Receive email confirmation after successful registration and  QR Code 

---

## 📁 Project Structure

```
my-project/
 ├── frontend/
 └── backend/
```

---

## ⚙️ How to Run the Project

### 🔹 Frontend

```
cd frontend
npm install
npm run dev
```

### 🔹 Backend

```
cd backend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder and add:

```
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
DB_URL=your_database_url
```

---

## 📊 Use Case

* Students can quickly find and register for campus events
* Organizers can efficiently manage participants and track registrations
* Departments can control organizer access (max 5 organizers)

---

## ✨ Future Improvements

* Event search & filters
* QR-based event check-in
* Admin panel for full control
* Notifications system

---

## 👨‍💻 Author

VINAY SRIKAR AND TEAM 
