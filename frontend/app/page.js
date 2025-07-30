'use client';
import { motion } from 'framer-motion';
import { Rocket, History, WalletCards, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Wallet from './component/Wallet';
import GameBoard from './component/GameBoard';
import RoundHistory from './component/RoundHistory';

export default function Home() {
  const username = 'alice'; // test user

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Crypto Crash
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-400 text-white" />
            <span className="font-medium text-white">{(username).toUpperCase()}</span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet */}
          <div className="lg:col-span-1">
            <Wallet username={username} />
          </div>

          {/* Middle Column - Game Board */}
          <div className="lg:col-span-1">
            <GameBoard username={username} />
          </div>

          {/* Right Column - Round History */}
          <div className="lg:col-span-1">
            <RoundHistory />
          </div>
        </motion.div>

        
      </motion.div>
    </main>
  );
}