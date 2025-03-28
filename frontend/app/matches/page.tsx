"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Trophy, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from 'react';
import { matchService } from '@/services/getAllMatchesService';
import { Match } from '@/types/getAllMatches';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matchService.getAllMatches();
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.error('Received invalid matches data:', data);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error in fetchMatches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!matches || !Array.isArray(matches)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">No matches available</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Matches</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex w-full max-w-sm items-center gap-2">
              <Input
                type="search"
                placeholder="Search matches, players, tournaments..."
                className="w-[300px]"
              />
              <Button variant="secondary" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link href="/matches/create">Schedule Match</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Matches</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {matches
              .filter((match) => match.winnerId === null)
              .map((match) => (
                <Card key={match.matchId} className="overflow-hidden">
                  <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                    <CardTitle className="text-lg">
                      {match.team1Name} vs {match.team2Name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">{match.tournamentName}</div>
                      <div className="text-sm text-cricket-brown">Format: {match.matchFormat}</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">{new Date(match.matchDate).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 ml-2 text-cricket-brown" />
                        <span className="text-sm">
                          {new Date(match.matchDate).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">
                          {match.venueName}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/matches/${match.matchId}`}>Match Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Results</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {matches
              .filter((match) => match.winnerId !== null)
              .map((match) => (
                <Card key={match.matchId} className="overflow-hidden">
                  <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                    <CardTitle className="text-lg">
                      {match.team1Name} vs {match.team2Name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">{match.tournamentName}</div>
                      <div className="text-sm text-cricket-brown">Format: {match.matchFormat}</div>
                      <div className="font-medium text-cricket-brown">{match.matchResult}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          {match.team1Name}: {match.scores?.team1 || 'TBD'}
                        </div>
                        <div>
                          {match.team2Name}: {match.scores?.team2 || 'TBD'}
                        </div>
                      </div>
                      {match.manOfTheMatchName && (
                        <div className="text-sm text-cricket-brown">
                          Man of the Match: {match.manOfTheMatchName}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">{new Date(match.matchDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">
                          {match.venueName}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/matches/${match.matchId}`}>Match Details</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/matches/${match.matchId}`}>Scorecard</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}

