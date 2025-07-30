import axios from 'axios';

let cache = null;
let lastFetched = 0;

export const getPrices = async () => {
  const now = Date.now();
  if (cache && now - lastFetched < 10000) {
    return cache;
  }

  try {
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );
    const data = res.data;

    cache = {
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
    };
    lastFetched = now;
    return cache;
  } catch (err) {
    console.error('Failed to fetch prices:', err.message);
    return cache || { BTC: 60000, ETH: 3000 }; // fallback values
  }
};
