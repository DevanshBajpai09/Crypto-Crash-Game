'use client';
import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// ✅ Lucide Icons
import { Rocket, Wallet, Coins, HandCoins } from 'lucide-react';

export default function GameBoard({ username }) {
  const [multiplier, setMultiplier] = useState(1.0);
  const [betting, setBetting] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [status, setStatus] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [maxMultiplier, setMaxMultiplier] = useState(1.0);

  const progress = Math.min((multiplier - 1) / 10 * 100, 100);
  const multiplierColor = multiplier < 2 ? 'text-green-500' : multiplier < 5 ? 'text-yellow-500' : 'text-red-500';

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('multiplier_update', (data) => {
      setMultiplier(data.multiplier);
      setMaxMultiplier(prev => Math.max(prev, data.multiplier));
    });

    socket.on('round_start', () => {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('round_crash', (data) => {
      setStatus(`Game crashed at ${data.crashPoint.toFixed(2)}x`);
      setBetting(false);
      setMaxMultiplier(1.0);
    });

    return () => {
      socket.off('multiplier_update');
      socket.off('round_crash');
      socket.off('round_start');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const placeBet = async () => {
    if (!betAmount || isNaN(Number(betAmount)) || Number(betAmount) <= 0) {
      setStatus('Please enter a valid bet amount');
      return;
    }

    try {
      setStatus('Placing bet...');
      await axios.post('https://crypto-crash-game-12-backend.onrender.com/api/players/bet', {
        username,
        usdAmount: Number(betAmount),
        currency,
      });
      setBetting(true);
      setStatus('Bet placed! Waiting to cash out...');
    } catch (err) {
      setStatus('Error placing bet');
      console.error(err);
    }
  };

  const cashOut = async () => {
    try {
      setStatus('Cashing out...');
      await axios.post('https://crypto-crash-game-12-backend.onrender.com/api/players/cashout', {
        username,
        multiplier,
        currency,
      });
      setStatus(`Successfully cashed out at ${multiplier.toFixed(2)}x!`);
      setBetting(false);
      setMaxMultiplier(1.0);
    } catch (err) {
      setStatus('Cashout failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen  from-gray-900 to-gray-950 p-4 md:p-1 mb-1 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl text-white font-gray-400">
                  <Rocket className="w-6 h-6 text-primary text-white" />
                  Crypto Crash
                </CardTitle>
                <CardDescription className="text-gray-400 mt-4">
                  {isConnected ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Disconnected
                    </span>
                  )}
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                {username}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {/* Multiplier Display */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Current Multiplier</span>
                <span className="text-sm font-medium">
                  Max: <span className="text-yellow-400">{maxMultiplier.toFixed(2)}x</span>
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={multiplier}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`text-center my-4 ${multiplierColor}`}
                >
                  <span className="text-5xl font-bold font-mono tracking-tighter">
                    {multiplier.toFixed(2)}x
                  </span>
                </motion.div>
              </AnimatePresence>

              <Progress value={progress} className="h-2 bg-gray-800" indicatorClassName="bg-gradient-to-r from-primary to-yellow-500" />
            </div>

            {/* Betting Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Bet Amount (USD)</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled={betting}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Currency</label>
                  <Select value={currency} onValueChange={setCurrency} disabled={betting}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="BTC" className="hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          Bitcoin (BTC)
                        </div>
                      </SelectItem>
                      <SelectItem value="ETH" className="hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-purple-400" />
                          Ethereum (ETH)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={placeBet}
                  disabled={betting || countdown > 0}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all"
                  size="lg"
                >
                  {countdown > 0 ? `Betting opens in ${countdown}s` : 'Place Bet'}
                </Button>
                <Button
                  onClick={cashOut}
                  disabled={!betting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90 transition-all"
                  size="lg"
                >
                  <HandCoins className="mr-2 h-4 w-4" />
                  Cash Out
                </Button>
              </div>
            </div>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-md bg-gray-800/50 border border-gray-700 text-center"
              >
                <p className="text-sm font-medium text-gray-200">{status}</p>
              </motion.div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2">How to play</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Place a bet before the round starts</li>
                <li>• Cash out before the game crashes to win</li>
                <li>• The longer you wait, the higher the multiplier</li>
                <li>• If you don&apos;t cash out before crash, you lose</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
