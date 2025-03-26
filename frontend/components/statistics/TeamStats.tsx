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

interface TeamStatsData {
  teamId: number;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  noResultMatches: number;
  totalPoints: number;
  netRunRate: number;
}

export function TeamStats() {
  const [teams, setTeams] = useState<TeamStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await fetch('/api/statistics/teams');
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching team statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, []);

  if (loading) {
    return <div>Loading team statistics...</div>;
  }

  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Matches Played</TableHead>
                <TableHead>Won</TableHead>
                <TableHead>Drawn</TableHead>
                <TableHead>Lost</TableHead>
                <TableHead>No Result</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Net Run Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.teamId}>
                  <TableCell className="font-medium">{team.teamName}</TableCell>
                  <TableCell>{team.matchesPlayed}</TableCell>
                  <TableCell>{team.matchesWon}</TableCell>
                  <TableCell>{team.matchesDrawn}</TableCell>
                  <TableCell>{team.matchesLost}</TableCell>
                  <TableCell>{team.noResultMatches}</TableCell>
                  <TableCell>{team.totalPoints}</TableCell>
                  <TableCell>{team.netRunRate.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 