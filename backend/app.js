import express from 'express';
import http from 'http';
import cors from 'cors';
import pkg from 'pg';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import playerRoutes from './routes/playerRoute.js';
import gameRoutes from './routes/gameRoute.js';
import { startGameLoop } from './controller/gameController.js';

dotenv.config();
const { Pool } = pkg;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// DB connection using NeonDB PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('PostgreSQL (NeonDB) Connected'))
  .catch((err) => console.error('DB Connection Error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/players', playerRoutes);
app.use('/api/game', gameRoutes);

// Export to use IO and DB pool in controllers
export { app, server, io, pool };

// Step 3: Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startGameLoop(io); // 👈 this line is essential
  console.log('Game loop started');
});
