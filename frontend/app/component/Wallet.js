'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bitcoin, Coins, WalletCards, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Wallet({ username }) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWallet = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`https://crypto-crash-game-12-backend.onrender.com/api/players/balance?username=${username}`);
      setWallet(res.data.balance);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wallet');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [username]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatCrypto = (value) => {
    return parseFloat(value).toFixed(6);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <WalletCards className="h-4 w-4 text-primary text-white" />
              Wallet Balance
            </CardTitle>
            <CardTitle className="text-lg font-bold text-white mt-1">
              {username.toUpperCase()}&apos;s Wallet
            </CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchWallet}
            disabled={refreshing}
            className="text-gray-400 hover:text-primary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-400">
              {error}
              <Button 
                onClick={fetchWallet} 
                variant="outline" 
                className="mt-2 text-sm"
                size="sm"
              >
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px] bg-gray-800" />
                <Skeleton className="h-6 w-[200px] bg-gray-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px] bg-gray-800" />
                <Skeleton className="h-6 w-[200px] bg-gray-800" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-3">
                  <Bitcoin className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Bitcoin</p>
                    <p className="text-lg font-bold">{formatCrypto(wallet.BTC.amount)} BTC</p>
                  </div>
                </div>
                <p className="text-sm text-green-400">{formatCurrency(wallet.BTC.usd)}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-3">
                  <Coins className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Ethereum</p>
                    <p className="text-lg font-bold">{formatCrypto(wallet.ETH.amount)} ETH</p>
                  </div>
                </div>
                <p className="text-sm text-green-400">{formatCurrency(wallet.ETH.usd)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
