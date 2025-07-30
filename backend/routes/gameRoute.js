import express from 'express';
import { getGameRounds, getCurrentMultiplier } from '../controller/gameController.js';

const router = express.Router();

router.get('/rounds', getGameRounds);
router.get('/multiplier', getCurrentMultiplier);

export default router;
