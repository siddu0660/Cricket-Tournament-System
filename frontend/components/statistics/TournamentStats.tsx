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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TournamentStatsData {
  tournamentId: number;
  tournamentName: string;
  startDate: string;
  endDate: string;
  tourLocation: string;
  numberOfTeams: number;
  numberOfMatches: number;
  tourFormat: string;
  winner: string;
  runner: string;
  playerOfTheTournament: string;
}

export function TournamentStats() {
  const [tournaments, setTournaments] = useState<TournamentStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  useEffect(() => {
    const fetchTournamentStats = async () => {
      try {
        const response = await fetch('/api/statistics/tournaments');
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournament statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentStats();
  }, []);

  const filteredTournaments = tournaments.filter(tournament =>
    selectedFormat === 'all' || tournament.tourFormat === selectedFormat
  );

  if (loading) {
    return <div>Loading tournament statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tournament Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="T20">T20</SelectItem>
                <SelectItem value="ODI">ODI</SelectItem>
                <SelectItem value="Test">Test</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament Name</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Matches</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Runner-up</TableHead>
                <TableHead>Player of Tournament</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTournaments.map((tournament) => (
                <TableRow key={tournament.tournamentId}>
                  <TableCell className="font-medium">{tournament.tournamentName}</TableCell>
                  <TableCell>{tournament.tourFormat}</TableCell>
                  <TableCell>{tournament.tourLocation}</TableCell>
                  <TableCell>
                    {new Date(tournament.startDate).toLocaleDateString()} - 
                    {new Date(tournament.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{tournament.numberOfTeams}</TableCell>
                  <TableCell>{tournament.numberOfMatches}</TableCell>
                  <TableCell>{tournament.winner}</TableCell>
                  <TableCell>{tournament.runner}</TableCell>
                  <TableCell>{tournament.playerOfTheTournament}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 