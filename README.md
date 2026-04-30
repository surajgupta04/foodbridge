

https://github.com/user-attachments/assets/632114d9-38df-4bc6-a506-4072892d5476



# 🍽️ FoodBridge — Real‑Time Food Rescue Platform

FoodBridge is a full‑stack MERN application that connects restaurants with surplus food to nearby NGOs in real‑time, helping reduce food waste and fight hunger.

Restaurants post surplus food → Nearby NGOs get notified instantly → NGO claims food → Confirmation code generated → NGO collects food → Restaurant marks as collected → Verified impact recorded.

---

# 🚀 Live Features

## 👤 Authentication & User Roles

* Secure Login & Registration
* Role‑based access (Restaurant / NGO)
* JWT Authentication with httpOnly Cookies
* Secure logout
* Profile management

---

## 🏪 Restaurant Features

* Post surplus food
* View nearby NGOs
* See claimed food
* Mark food as collected
* View NGO who claimed the food
* Edit restaurant profile

---

## 🤝 NGO Features

* View nearby food posts
* Claim available food
* Get confirmation code
* Real‑time notification when food is available
* Edit NGO profile

---

## 📍 Location Based Matching

* Geocoding using Nominatim API
* MongoDB 2dsphere index
* Nearby NGO detection
* Radius‑based food discovery

---

## ⚡ Real‑Time Notifications

* Socket.io integration
* NGO gets instant food alerts
* Private socket rooms for each user

---

## ✅ Verified Impact System

Food is only counted as rescued when:

1. NGO claims food
2. NGO arrives physically
3. Restaurant marks "Collected"

This ensures **real and verified impact metrics**.

---

# 🧠 Smart Optimizations

## Geocoding Cache

* In‑memory caching
* Avoids repeated API calls
* Faster performance

## Cookie‑Based Authentication

* httpOnly cookies
* Secure authentication
* XSS protection

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Axios
* Socket.io Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JWT Authentication

## APIs & Services

* Nominatim Geocoding
* Hugging Face AI

---

# 📁 Project Structure

```
FoodBridge
│
├── frontend
│   ├── pages
│   ├── components
│   ├── context
│   └── utils
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── utils
```

---

# 🔐 Authentication Flow

1. User Login
2. Server generates JWT
3. Token stored in httpOnly cookie
4. Browser sends cookie automatically
5. Protected routes validated

---

# ⚙️ Installation & Setup

## Clone Repository

```
git clone https://github.com/yourusername/foodbridge.git
```

---

## Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run backend:

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# 🌍 Environment Variables

Backend `.env`

```
PORT=
MONGO_URI=
JWT_SECRET=
```

---

# 📸 Screenshots

(Add screenshots here)

---

# 📈 Future Improvements

* Google Maps Integration
* Push Notifications
* Admin Dashboard
* Analytics Dashboard
* Mobile App

---

# 🎯 Use Case

* Restaurants reduce food waste
* NGOs get food faster
* Real‑time food rescue
* Verified impact tracking

---

# 🧑‍💻 Author

Suraj

---

# ⭐ If you like this project

Give it a ⭐ on GitHub

---

# 📜 License

MIT License
