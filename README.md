# SplitIt 💸

> Split expenses, not friendships.

A premium glassmorphic expense-splitting web app built with the MERN stack.

**Built by Gagandeep Singh Rathore** — CS (Cyber Security), SRM Institute of Science and Technology.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), Tailwind CSS v3, Framer Motion, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + Bcrypt (12 salt rounds) |
| Security | Helmet, Input Sanitization, BOLA checks |

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account ([free tier](https://www.mongodb.com/atlas))

### 1. Clone & Setup Server
```bash
cd server
cp .env .env.local        # Edit with your MongoDB URI + JWT_SECRET
npm install
npm run dev               # Starts on http://localhost:5000
```

### 2. Setup Client
```bash
cd client
npm install
npm run dev               # Starts on http://localhost:5173
```

### 3. Configure `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/splitit
JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d
```

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET  | `/api/auth/me` | Get current user (🔒) |
| GET  | `/api/auth/users/search?email=` | Search users (🔒) |

### Expenses
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/expenses` | Create expense (🔒) |
| GET  | `/api/expenses` | List my expenses (🔒) |
| GET  | `/api/expenses/:id` | Get single expense (🔒) |
| PUT  | `/api/expenses/:id` | Update expense (🔒) |
| DELETE | `/api/expenses/:id` | Delete expense (🔒) |
| GET  | `/api/expenses/balances` | Get net balances (🔒) |

🔒 = Requires `Authorization: Bearer <token>` header

---

## Design System — "Glass Fintech"

- **Charcoal** `#1A1A2E` — Primary text
- **Rose** `#E63946` — Debt / Accent / CTA
- **Emerald** `#2DC653` — Credit / Success
- **Glass surfaces** — `backdrop-blur(16px)` + semi-transparent white
- **Corner radius** — 40px cards, 16px buttons
- **Typography** — Inter (body) + Outfit 900 (headings)
- **Animations** — Framer Motion spring physics on every interaction

---

## Security Features

1. **Password Hashing** — Bcrypt with 12 salt rounds
2. **JWT Auth** — Signed tokens with 7-day expiry
3. **Input Sanitization** — Strips MongoDB `$` operator injection keys
4. **BOLA Protection** — Ownership validation on all mutations
5. **Helmet** — Secure HTTP headers (XSS, clickjacking, MIME sniffing)
6. **Anti-Enumeration** — Generic error messages on auth endpoints
7. **Rate Limiting** — JSON body size cap (1MB)

---

## License

MIT
