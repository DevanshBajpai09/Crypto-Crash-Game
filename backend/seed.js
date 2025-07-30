import pool from './db.js';

const seedPlayers = async () => {
  const players = [
    { username: 'alice', btc: 0.01, eth: 0.2 },
    { username: 'bob', btc: 0.05, eth: 0.1 },
    { username: 'charlie', btc: 0.02, eth: 0.15 },
  ];

  for (const p of players) {
    await pool.query(
      'INSERT INTO players (username, wallet_btc, wallet_eth) VALUES ($1, $2, $3)',
      [p.username, p.btc, p.eth]
    );
  }

  console.log('Seeded sample players');
  process.exit();
};

seedPlayers();
