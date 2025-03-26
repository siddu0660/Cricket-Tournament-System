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
import { Input } from "@/components/ui/input";

interface MatchStatsData {
  matchId: number;
  tournamentName: string;
  team1Name: string;
  team2Name: string;
  venueName: string;
  matchDate: string;
  matchFormat: string;
  winner: string;
  matchResult: string;
  tossWinner: string;
  tossDecision: string;
  manOfTheMatch: string;
  team1Score: string;
  team2Score: string;
}

export function MatchStats() {
  const [matches, setMatches] = useState<MatchStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMatchStats = async () => {
      try {
        const response = await fetch('/api/statistics/matches');
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching match statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchStats();
  }, []);

  const filteredMatches = matches.filter(match =>
    (selectedFormat === 'all' || match.matchFormat === selectedFormat) &&
    (searchQuery === '' || 
      match.team1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournamentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <div>Loading match statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Match Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
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
            <Input
              placeholder="Search by team or tournament..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              //className="w-[300px]"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Toss</TableHead>
                <TableHead>Man of Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.map((match) => (
                <TableRow key={match.matchId}>
                  <TableCell className="font-medium">{match.tournamentName}</TableCell>
                  <TableCell>
                    {match.team1Name} vs {match.team2Name}
                  </TableCell>
                  <TableCell>{match.venueName}</TableCell>
                  <TableCell>{new Date(match.matchDate).toLocaleDateString()}</TableCell>
                  <TableCell>{match.matchFormat}</TableCell>
                  <TableCell>
                    {match.team1Score} / {match.team2Score}
                  </TableCell>
                  <TableCell>{match.matchResult}</TableCell>
                  <TableCell>
                    {match.tossWinner} ({match.tossDecision})
                  </TableCell>
                  <TableCell>{match.manOfTheMatch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 