'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react'; // ✅ Lucide History icon

export default function RoundHistory() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRounds = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://crypto-crash-game-12-backend.onrender.com/api/game/rounds');
      setRounds(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch round history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const getCrashPointColor = (crashPoint) => {
    return crashPoint < 2 ? 'bg-green-500/20 text-green-400' : 
           crashPoint < 5 ? 'bg-yellow-500/20 text-yellow-400' : 
           'bg-red-500/20 text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-white font-gray-400">
            <History className="w-5 h-5 text-primary text-white" /> {/* ✅ Lucide Icon used */}
            Round History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-400">
              {error}
              <Button 
                onClick={fetchRounds} 
                variant="outline" 
                className="mt-2 text-sm"
              >
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-gray-800" />
              ))}
            </div>
          ) : rounds.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No rounds found
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-gray-400">Round</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-right text-gray-400">Crash Point</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {rounds.map((round) => (
                      <motion.tr
                        key={round.round_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-800 hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium text-white">
                          #{round.round_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-600 text-green-400">
                            Completed
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getCrashPointColor(round.crash_point)}>
                            {Number(round.crash_point).toFixed(2)}x
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
