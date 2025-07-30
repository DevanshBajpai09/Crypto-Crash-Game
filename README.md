# 🚀 Crypto Crash Game - Multiplayer Realtime Betting App

An exciting **multiplayer crash game** where players place USD bets converted into cryptocurrencies like **BTC** or **ETH**. As the multiplier increases, players must **cash out before the crash** to win.

Built with **Next.js**, **Tailwind CSS**, **Socket.IO**, **Express**, and **Neondb**, featuring **real-time updates**, beautiful UI, and real cryptocurrency logic (conversion powered by CoinGecko API).

---

## 📸 Preview

> Replace with actual image path:

![Game UI Preview](./public/crash-preview.png)

---

## 🧩 Features

- 🎮 Real-time crash game with multiplier logic
- 🔁 Live WebSocket updates (multiplier, crash, countdown)
- 🧠 USD to BTC/ETH conversion using CoinGecko API
- 👛 Simulated wallet with crypto balances
- 📜 Round history with past multipliers
- 💥 Animated Framer Motion UI
- 🔐 Input validation, error handling, and retry logic

---

## 🛠️ Tech Stack

| Layer     | Technology                                 |
|-----------|---------------------------------------------|
| Frontend  | Next.js, Tailwind CSS, ShadCN UI, Framer Motion |
| Backend   | Node.js, Express.js, Neondb               |
| Realtime  | Socket.IO                                   |
| Database  | Neondb                          |
| API       | CoinGecko API (crypto prices)               |
| Hosting   | Vercel , Render       |

---

## 🚀 Getting Started

### 📦 Install Locally

```bash
# Clone the repo
git clone https://github.com/your-username/crypto-crash-game.git
cd crypto-crash-game

# Setup Backend
cd backend
npm install
npm run dev

# Setup Frontend
cd ../frontend
npm install
npm run dev

```
## ⚙️ Environment Variables

```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crashgame
COINGECKO_API=https://api.coingecko.com/api/v3
```

### 🌐 API Reference

```bash
http://localhost:5000/api

```

### 🧑‍💼 Players API
## GET /players/balance?username=<username>
Response:
```bash
{
  "balance": {
    "BTC": { "amount": 0.00123, "usd": 75.00 },
    "ETH": { "amount": 0.0123, "usd": 40.50 }
  }
}

```

## POST /players/bet
Body:
```bash
{
  "username": "devansh",
  "usdAmount": 20,
  "currency": "BTC"
}


```
## POST /players/cashout
Body:
```bash
{
  "username": "devansh",
  "multiplier": 2.5,
  "currency": "BTC"
}

```
### 🎮 Game API
## GET /game/rounds
Returns past game rounds.
Response:
```bash
[
  {
    "round_id": "rnd_001",
    "crash_point": 3.45
  },
  {
    "round_id": "rnd_002",
    "crash_point": 1.95
  }
]

```

### 📂 Project Structure

``` bash
/backend
  ├── routes/
  ├── models/
  ├── controllers/
  └── server.js

/frontend
  ├── app/
  ├── components/
  ├── utils/
  └── tailwind.config.js

```

### 👨‍💻 Sample Players
Use this command to seed the database with demo users:
```bash
cd backend
node seed.js

```


