import crypto from 'crypto';

// Provably fair: generates a crash point from seed
export const generateCrashPoint = (seed) => {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  const h = parseInt(hash.slice(0, 13), 16);
  const e = Math.pow(2, 52);

  return Math.max(1.00, Math.floor((100 * e) / (e - h)) / 100);
};
