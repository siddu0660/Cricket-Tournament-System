'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface PlayerStatsData {
  playerId: number;
  firstName: string;
  secondName: string;
  matchesPlayed: number;
  totalRuns: number;
  highestScore: number;
  strikeRate: number;
  totalWickets: number;
  bestBowlingFigures: string;
  economyRate: number;
  numberOf6s: number;
  numberOf4s: number;
  numberOfManOfTheMatch: number;
}

export function PlayerStats() {
  const [players, setPlayers] = useState<PlayerStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch('/api/statistics/players');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching player statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, []);

  const filteredPlayers = players.filter(player =>
    `${player.firstName} ${player.secondName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    // Implement your search logic here
    // This will trigger when the button is clicked
    // You can use the searchQuery state that's already available
  };

  if (loading) {
    return <div>Loading player statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Player Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player Name</TableHead>
                <TableHead>Matches</TableHead>
                <TableHead>Runs</TableHead>
                <TableHead>Highest Score</TableHead>
                <TableHead>Strike Rate</TableHead>
                <TableHead>Wickets</TableHead>
                <TableHead>Best Bowling</TableHead>
                <TableHead>Economy</TableHead>
                <TableHead>4s</TableHead>
                <TableHead>6s</TableHead>
                <TableHead>Man of Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.playerId}>
                  <TableCell className="font-medium">
                    {player.firstName} {player.secondName}
                  </TableCell>
                  <TableCell>{player.matchesPlayed}</TableCell>
                  <TableCell>{player.totalRuns}</TableCell>
                  <TableCell>{player.highestScore}</TableCell>
                  <TableCell>{player.strikeRate.toFixed(2)}</TableCell>
                  <TableCell>{player.totalWickets}</TableCell>
                  <TableCell>{player.bestBowlingFigures}</TableCell>
                  <TableCell>{player.economyRate.toFixed(2)}</TableCell>
                  <TableCell>{player.numberOf4s}</TableCell>
                  <TableCell>{player.numberOf6s}</TableCell>
                  <TableCell>{player.numberOfManOfTheMatch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 