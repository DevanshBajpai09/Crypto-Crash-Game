import express from 'express';
import {
  checkBalance,
  placeBet,
  cashOut,
} from '../controller/playerController.js';

const router = express.Router();

router.get('/balance', checkBalance);
router.post('/bet', placeBet);
router.post('/cashout', cashOut);

export default router;
