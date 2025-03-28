"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addMatches } from '@/services/creatematchService';
import { MatchData } from '@/types/match';
import { useRouter } from 'next/navigation';
import { CalendarDays } from "lucide-react"

interface AddMatchFormProps {
  tournamentId: number;
  teams: Array<{ id: number; name: string }>;
  venues: Array<{ id: number; name: string }>;
}

export default function AddMatchForm({ tournamentId, teams, venues }: AddMatchFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<MatchData>>({
    tournamentId: tournamentId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.team1Id || !formData.team2Id || !formData.venueId || !formData.matchDate) {
        throw new Error('Please fill all required fields');
      }

      await addMatches(tournamentId, [formData as MatchData]);
      router.push(`/tournaments/${tournamentId}/matches`);
    } catch (error) {
      console.error('Failed to create match:', error);
      // You might want to add proper error handling/display here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-dark-olive">Add New Match</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-olive mb-1 block">Team 1</label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, team1Id: Number(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select first team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-olive mb-1 block">Team 2</label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, team2Id: Number(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select second team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-olive mb-1 block">Venue</label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, venueId: Number(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id.toString()}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-olive mb-1 block">Match Date</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  onChange={(e) => setFormData({ ...formData, matchDate: new Date(e.target.value) })}
                />
                <CalendarDays className="absolute right-3 top-2.5 h-4 w-4 text-olive" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-light-teal hover:bg-teal text-dark-olive"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Match'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 