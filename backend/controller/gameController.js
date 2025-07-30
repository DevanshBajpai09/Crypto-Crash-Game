import pool from '../db.js';
import { generateCrashPoint } from '../utils/crashGenerator.js';

let currentMultiplier = 1;
let gameInterval = null;
let gameStartTime = null;
let crashPoint = 2 + Math.random() * 8;

export const startGameLoop = (io) => {
  setInterval(async () => {
    // New round
    const seed = Math.random().toString(36).substring(2);
    crashPoint = generateCrashPoint(seed);
    currentMultiplier = 1;
    gameStartTime = Date.now();

    const round_id = Date.now();
    await pool.query(
      `INSERT INTO game_rounds (round_id, crash_point, seed, hash) VALUES ($1, $2, $3, $4)`,
      [round_id, crashPoint, seed, seed + round_id]
    );

    io.emit('round_start', { round_id, crashPoint });

    gameInterval = setInterval(() => {
      const elapsed = (Date.now() - gameStartTime) / 1000;
      currentMultiplier = parseFloat((1 + elapsed * 0.1).toFixed(2));

      if (currentMultiplier >= crashPoint) {
        clearInterval(gameInterval);
        io.emit('round_crash', { crashPoint });
      } else {
        io.emit('multiplier_update', { multiplier: currentMultiplier });
      }
    }, 100);
  }, 15000); // every 15 seconds
};

export const getGameRounds = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM game_rounds ORDER BY started_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCurrentMultiplier = (req, res) => {
  res.json({ multiplier: currentMultiplier });
};
