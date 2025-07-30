import pool from '../db.js';
import { getPrices } from '../utils/priceCache.js';
import { v4 as uuidv4 } from 'uuid';

export const checkBalance = async (req, res) => {
  const { username } = req.query;
  try {
    const result = await pool.query('SELECT * FROM players WHERE username = $1', [username]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Player not found' });

    const player = result.rows[0];
    const prices = await getPrices();
    const balance = {
      BTC: {
        amount: parseFloat(player.wallet_btc),
        usd: (player.wallet_btc * prices.BTC).toFixed(2),
      },
      ETH: {
        amount: parseFloat(player.wallet_eth),
        usd: (player.wallet_eth * prices.ETH).toFixed(2),
      },
    };
    res.json({ username, balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const placeBet = async (req, res) => {
  const { username, usdAmount, currency } = req.body;
  if (!['BTC', 'ETH'].includes(currency)) return res.status(400).json({ message: 'Invalid currency' });

  try {
    const prices = await getPrices();
    const price = prices[currency];
    const cryptoAmount = usdAmount / price;

    const userRes = await pool.query('SELECT * FROM players WHERE username = $1', [username]);
    if (userRes.rowCount === 0) return res.status(404).json({ message: 'Player not found' });

    const player = userRes.rows[0];
    const walletField = currency === 'BTC' ? 'wallet_btc' : 'wallet_eth';

    if (parseFloat(player[walletField]) < cryptoAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    await pool.query(`UPDATE players SET ${walletField} = ${walletField} - $1 WHERE id = $2`, [
      cryptoAmount,
      player.id,
    ]);

    await pool.query(
      `INSERT INTO transactions 
        (player_id, usd_amount, crypto_amount, currency, transaction_type, transaction_hash, price_at_time)
       VALUES ($1, $2, $3, $4, 'bet', $5, $6)`,
      [
        player.id,
        usdAmount,
        cryptoAmount,
        currency,
        uuidv4().slice(0, 10),
        price,
      ]
    );

    res.json({ message: 'Bet placed successfully', cryptoAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cashOut = async (req, res) => {
  const { username, multiplier, currency } = req.body;
  if (!['BTC', 'ETH'].includes(currency)) return res.status(400).json({ message: 'Invalid currency' });

  try {
    const prices = await getPrices();
    const price = prices[currency];

    const userRes = await pool.query('SELECT * FROM players WHERE username = $1', [username]);
    if (userRes.rowCount === 0) return res.status(404).json({ message: 'Player not found' });

    const player = userRes.rows[0];

    const recentBetRes = await pool.query(
      `SELECT * FROM transactions 
       WHERE player_id = $1 AND transaction_type = 'bet' 
       ORDER BY created_at DESC LIMIT 1`,
      [player.id]
    );
    if (recentBetRes.rowCount === 0) return res.status(400).json({ message: 'No active bet found' });

    const lastBet = recentBetRes.rows[0];
    const cryptoEarned = lastBet.crypto_amount * multiplier;
    const walletField = currency === 'BTC' ? 'wallet_btc' : 'wallet_eth';

    await pool.query(
      `UPDATE players SET ${walletField} = ${walletField} + $1 WHERE id = $2`,
      [cryptoEarned, player.id]
    );

    await pool.query(
      `INSERT INTO transactions 
        (player_id, usd_amount, crypto_amount, currency, transaction_type, transaction_hash, price_at_time)
       VALUES ($1, $2, $3, $4, 'cashout', $5, $6)`,
      [
        player.id,
        cryptoEarned * price,
        cryptoEarned,
        currency,
        uuidv4().slice(0, 10),
        price,
      ]
    );

    res.json({
      message: 'Cashout successful',
      payout: cryptoEarned,
      usd: (cryptoEarned * price).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
