'use client';

import { useEffect, useState, use } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Trophy, Clock, Award, User, ArrowLeft } from "lucide-react"
import { getMatchDetails } from '@/services/matchService';
import { Match, MatchAPIResponse } from '@/types/matchDetails';

export default function MatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const data: MatchAPIResponse = await getMatchDetails(Number(resolvedParams.id));
        // Transform the API response to match the expected structure
        const transformedData: Match = {
          team1: {
            name: data.team1Name,
            id: data.team1Id,
            score: "TBD", 
            overs: "0.0"   
          },
          team2: {
            name: data.team2Name,
            id: data.team2Id,
            score: "TBD",  // Add these if available from API
            overs: "0.0"   // Add these if available from API
          },
          tournament: {
            name: data.tournamentName,
            id: data.tournamentId
          },
          date: data.matchDate,
          time: new Date(data.matchDate).toLocaleTimeString(),
          venue: data.venueName,
          location: "", // Add if available from API
          result: data.matchResult,
          toss: {
            winner: "TBD", // Add if available from API
            decision: "TBD" // Add if available from API
          },
          umpires: data.umpires,
          manOfTheMatch: {
            name: data.manOfTheMatchName || "TBD",
            performance: "TBD" // Add if available from API
          },
          battingStats: {
            team1: [], 
            team2: []  
          },
          bowlingStats: {
            team1: [], 
            team2: []  
          }
        };
        setMatch(transformedData);
      } catch (err) {
        setError('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !match) {
    return <div className="flex min-h-screen items-center justify-center">{error}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/matches">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Trophy className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Match Details</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <Card className="mb-6">
          <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {match.team1.name} vs {match.team2.name}
                </CardTitle>
                <CardDescription className="text-cricket-darkOlive/80">{match.tournament.name}</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/tournaments/${match.tournament.id}`}>View Tournament</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cricket-brown" />
                  <span>{new Date(match.date).toLocaleDateString()}</span>
                  <Clock className="h-5 w-5 ml-2 text-cricket-brown" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cricket-brown" />
                  <span>
                    {match.venue}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cricket-brown" />
                  <span className="font-medium">{match.result}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cricket-brown" />
                  <span>
                    Toss: {match.toss.winner} won and elected to {match.toss.decision}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-cricket-brown" />
                  <span>Umpires: {match.umpires.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cricket-brown" />
                  <span>
                    Man of the Match: {match.manOfTheMatch.name} ({match.manOfTheMatch.performance})
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{match.team1.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{match.team1.score}</div>
                  <div className="text-sm text-muted-foreground">{match.team1.overs} overs</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{match.team2.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{match.team2.score}</div>
                  <div className="text-sm text-muted-foreground">{match.team2.overs} overs</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="scorecard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            <TabsTrigger value="commentary">Commentary</TabsTrigger>
          </TabsList>
          <TabsContent value="scorecard" className="border rounded-md mt-2 p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team1.name} Batting</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Batter</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Balls</th>
                        <th className="p-2 text-center">4s</th>
                        <th className="p-2 text-center">6s</th>
                        <th className="p-2 text-center">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.battingStats.team1.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.balls}</td>
                          <td className="p-2 text-center">{player.fours}</td>
                          <td className="p-2 text-center">{player.sixes}</td>
                          <td className="p-2 text-center">{player.strikeRate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team2.name} Bowling</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Bowler</th>
                        <th className="p-2 text-center">Overs</th>
                        <th className="p-2 text-center">Maidens</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Wickets</th>
                        <th className="p-2 text-center">Economy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.bowlingStats.team2.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.overs}</td>
                          <td className="p-2 text-center">{player.maidens}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.wickets}</td>
                          <td className="p-2 text-center">{player.economy.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team2.name} Batting</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Batter</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Balls</th>
                        <th className="p-2 text-center">4s</th>
                        <th className="p-2 text-center">6s</th>
                        <th className="p-2 text-center">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.battingStats.team2.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.balls}</td>
                          <td className="p-2 text-center">{player.fours}</td>
                          <td className="p-2 text-center">{player.sixes}</td>
                          <td className="p-2 text-center">{player.strikeRate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team1.name} Bowling</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Bowler</th>
                        <th className="p-2 text-center">Overs</th>
                        <th className="p-2 text-center">Maidens</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Wickets</th>
                        <th className="p-2 text-center">Economy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.bowlingStats.team1.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.overs}</td>
                          <td className="p-2 text-center">{player.maidens}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.wickets}</td>
                          <td className="p-2 text-center">{player.economy.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="commentary" className="border rounded-md mt-2 p-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Commentary not available for this match</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

